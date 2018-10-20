import hashlib
import json
import os
import pickle
import random
import redis
import sys

from bson.json_util import dumps
from dateutil import parser
from datetime import datetime

# import common package in parent directory
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'common'))

import config_reader as reader
import classification_service_client
import mongodb_client
import news_api_client
import recommendation_service_client

from cloudAMQP_client import CloudAMQPClient

config = reader.read_config()
REDIS_HOST = config.get('REDIS', 'REDIS_HOST')
REDIS_PORT = config.getint('REDIS', 'REDIS_PORT')

NEWS_TABLE_NAME = config.get('NEWS', 'NEWS_TABLE_NAME')

NEWS_LIMIT = config.getint('NEWS', 'NEWS_LIMIT')
# 9 news per page
NEWS_LIST_BATCH_SIZE = config.getint('NEWS', 'NEWS_LIST_BATCH_SIZE')
# Much prefer 3600 but for testing functionality we set 60
USER_NEWS_TIME_OUT_IN_SECONDS = config.getint('NEWS', 'USER_NEWS_TIME_OUT')

# Click log settings
CLICK_LOG_TABLE_NAME = config.get('NEWS', 'CLICK_LOG_TABLE_NAME')
LOG_CLICKS_TASK_QUEUE_URL = config.get('PIPELINE', 'LOG_CLICKS_QUEUE_URL')
LOG_CLICKS_TASK_QUEUE_NAME = config.get('PIPELINE', 'LOG_CLICKS_QUEUE_NAME')

cloudAMQP_client = CloudAMQPClient(
    LOG_CLICKS_TASK_QUEUE_URL, LOG_CLICKS_TASK_QUEUE_NAME)
redis_client = redis.StrictRedis(REDIS_HOST, REDIS_PORT, db=0)


def _formatNews(news, preference):
    topPreference = None
    if preference is not None and len(preference) > 0:
        topPreference = preference[0]

    for report in news:
        # Remove text field to save bandwidth.
        if 'text' in report:
            del report['text']
        if (topPreference is not None and
            'class' in report and
            report['class'] is not None and
                report['class'] in topPreference):
            report['reason'] = 'Recommend'

        if report['publishedAt'].date() == datetime.today().date():
            report['time'] = 'today'
        report['publishedAt'] = report['publishedAt'].strftime("%Y-%m-%d")
    # Data formats for frontend usage
    return json.loads(dumps(news))


def getNewsSummariesForUser(user_id, page_num):
    ''' Form a news lists based on page_number and user_id.

    Keyword arguments:
    user_id -- user login id
    page_num -- the page user views
    '''
    page_num = int(page_num)
    # [begin_index, end_index)
    begin_index = (page_num - 1) * NEWS_LIST_BATCH_SIZE
    end_index = page_num * NEWS_LIST_BATCH_SIZE

    # The final list of news to be returned.
    sliced_news = []

    if redis_client.get(user_id) is not None:
        # Since redis could only store a string, we need to convert back to json
        # this will return json
        news_digests = pickle.loads(redis_client.get(user_id))

        # If begin_index is out of range, this will return empty list;
        # If end_index is out of range (begin_index is within the range), this
        # will return all remaining news ids.
        sliced_news_digests = news_digests[begin_index:end_index]
        print sliced_news_digests
        db = mongodb_client.get_db()
        # {'$in':sliced_news_digests} will search all digest in sliced_news_digest
        sliced_news = list(db[NEWS_TABLE_NAME].find(
            {'digest': {'$in': sliced_news_digests}}))
    else:
        db = mongodb_client.get_db()
        # the newest one comes first
        total_news = list(db[NEWS_TABLE_NAME].find().sort(
            [('publishedAt', -1)]).limit(NEWS_LIMIT))
        # build a map maps from digest
        total_news_digests = map(lambda x: x['digest'], total_news)
        redis_client.set(user_id, pickle.dumps(total_news_digests))
        redis_client.expire(user_id, USER_NEWS_TIME_OUT_IN_SECONDS)

        sliced_news = total_news[begin_index:end_index]
    preference = recommendation_service_client.getPreferenceForUser(user_id)
    return _formatNews(sliced_news, preference)


def getNewsDefault():
    db = mongodb_client.get_db()
    # Retrieve the newest version
    total_news = list(db[NEWS_TABLE_NAME].find().sort(
        [('publishedAt', -1)]).limit(NEWS_LIMIT))
    part_news = random.sample(total_news, NEWS_LIST_BATCH_SIZE)
    part_news.sort(key=lambda x: x['publishedAt'], reverse=True)
    return _formatNews(part_news, None)


def getNewsFromSearchKey(query, page_num):
    news = news_api_client.getNewsFromSearchKey(query, page_num)
    if news is not None and len(news) > 0:
        for report in news:
            report['class'] = classification_service_client.classifyTopic(
                report['title'])
            report['publishedAt'] = parser.parse(report['publishedAt'])
            news_digest = hashlib.md5(report['title'].encode('utf-8')).digest().encode('base64')
            report['digest'] = news_digest
    return _formatNews(news, None)


def logNewsClickForUser(user_id, news_id):
    message = {'userId': user_id, 'newsId': news_id,
               'timestamp': datetime.utcnow()}
    db = mongodb_client.get_db()
    # For backup, we write into database
    db[CLICK_LOG_TABLE_NAME].insert(message)

    # send log task to process preference
    message = {'userId': user_id, 'newsId': news_id,
               'timestamp': str(datetime.utcnow())}
    cloudAMQP_client.sendMessage(message)
