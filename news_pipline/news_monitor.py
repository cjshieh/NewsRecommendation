from base64 import b64encode
import datetime
import hashlib
import inspect
import redis
import os
import sys

currentdir = os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))
parentdir = os.path.dirname(currentdir)
sys.path.append(os.path.join(parentdir, "common"))

import news_api_client
from cloudAMQP_client import CloudAMQPClient

SLEEP_TIME_IN_SECONDS = 10
# it will expires in 3 days
NEWS_TIME_OUT_IN_SECONDS = 3600 * 24 * 3

REDIS_HOST = 'localhost'
REDIS_PORT = 6379

SCRAPE_NEWS_TASK_QUEUE_URL = "amqp://rurhenzz:d-baqsTGTIHBRBcJONCV31w5Lu_Byl7N@dinosaur.rmq.cloudamqp.com/rurhenzz"
SCRAPE_NEWS_TASK_QUEUE_NAME = "scrape_news_task"

NEWS_SOURCES = [
    'bbc-news',
    'bbc-sport',
    'bloomberg',
    'cnn',
    'entertainment-weekly',
    'espn',
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
        enc_key = hashlib.md5(news['title']).digest()
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

    print("Fetched %d news." % num_of_news_news)

    cloudAMQP_client.sleep(SLEEP_TIME_IN_SECONDS)
