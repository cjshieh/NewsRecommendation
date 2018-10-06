from base64 import b64encode
import datetime
import hashlib
import inspect
import redis
import os
import sys

sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'common'))

import news_api_client
import config_reader as reader
from cloudAMQP_client import CloudAMQPClient

config = reader.read_config()
SCRAPE_NEWS_TASK_QUEUE_URL = config.get('PIPELINE', 'SCRAPE_QUEUE_URL')
SCRAPE_NEWS_TASK_QUEUE_NAME = config.get('PIPELINE', 'SCRAPE_QUEUE_NAME')

SLEEP_TIME_IN_SECONDS = config.getint('PIPELINE', 'MONITOR_SLEEP_TIME') 

REDIS_HOST = config.get('REDIS', 'REDIS_HOST')
REDIS_PORT = config.getint('REDIS', 'REDIS_PORT')
# it will expires in 3 days
NEWS_TIME_OUT_IN_SECONDS = 3600 * 24 * 3

NEWS_SOURCES = [
    'bbc-news',
    'bbc-sport',
    'business-insider',
    'cnn',
    'entertainment-weekly',
    'espn',
    'fox-news',
    'ign',
    'techcrunch',
    'the-new-york-times',
    'the-wall-street-journal',
    'the-washington-post'
]

redis_client = redis.StrictRedis(REDIS_HOST, REDIS_PORT)
cloudAMQP_client = CloudAMQPClient(
    SCRAPE_NEWS_TASK_QUEUE_URL, SCRAPE_NEWS_TASK_QUEUE_NAME)

while True:
    news_list = news_api_client.getNewsFromSource(NEWS_SOURCES)
    num_of_news_news = 0

    for news in news_list:
        # news_digest = hashlib.md5(news['title'].encode(
            # 'utf-8')).digest().encode('base64')
        enc_key = hashlib.md5(news['title'].encode('utf-8')).digest()
        news_digest = b64encode(enc_key).decode('utf-8')

        if redis_client.get(news_digest) is None:
            num_of_news_news = num_of_news_news + 1
            news['digest'] = news_digest

            if news['publishedAt'] is None:
                news['publishedAt'] = datetime.datetime.utcnow().strftime(
                    "%Y-%m-%dT%H:%M:%SZ")

            redis_client.set(news_digest, "True")
            redis_client.expire(news_digest, NEWS_TIME_OUT_IN_SECONDS)

            cloudAMQP_client.sendMessage(news)

    print "Fetched %d news." % num_of_news_news

    cloudAMQP_client.sleep(SLEEP_TIME_IN_SECONDS)
