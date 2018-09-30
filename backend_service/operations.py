import json
import os
import pickle
import random
import redis
import sys

from bson.json_util import dumps
from datetime import datetime

# import common package in parent directory
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'common'))

import mongodb_client
import config_reader as reader
from cloudAMQP_client import CloudAMQPClient

config = reader.read_config()
REDIS_HOST = config.get('REDIS', 'REDIS_HOST')
REDIS_PORT = config.getint('REDIS', 'REDIS_PORT')

NEWS_TABLE_NAME = "news"

NEWS_LIMIT = config.getint('NEWS', 'NEWS_LIMIT')
# 9 news per page
NEWS_LIST_BATCH_SIZE = config.getint('NEWS', 'NEWS_LIST_BATCH_SIZE')
# Much prefer 3600 but for testing functionality we set 60
USER_NEWS_TIME_OUT_IN_SECONDS = config.getint('NEWS', 'USER_NEWS_TIME_OUT')


redis_client = redis.StrictRedis(REDIS_HOST, REDIS_PORT, db=0)

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
        sliced_news = list(db[NEWS_TABLE_NAME].find({'digest':{'$in':sliced_news_digests}}))
    else:
        db = mongodb_client.get_db()
        # the newest one comes first
        total_news = list(db[NEWS_TABLE_NAME].find().sort([('publishedAt', -1)]).limit(NEWS_LIMIT))
        # build a map maps from digest
        total_news_digests = map(lambda x:x['digest'], total_news)
        redis_client.set(user_id, pickle.dumps(total_news_digests))
        redis_client.expire(user_id, USER_NEWS_TIME_OUT_IN_SECONDS)

        sliced_news = total_news[begin_index:end_index]

    for news in sliced_news:
        # Remove text field to save bandwidth.
        del news['text']
        if news['publishedAt'].date() == datetime.today().date():
            news['time'] = 'today'
    # Data formats for frontend usage
    return json.loads(dumps(sliced_news))
