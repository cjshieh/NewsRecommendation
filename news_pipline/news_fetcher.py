# This file should be run on python3
import inspect
# TODO: print message into logger
import logging
from newspaper import Article
import os
import sys

currentdir = os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))
parentdir = os.path.dirname(currentdir)
sys.path.append(os.path.join(parentdir, "common"))

from cloudAMQP_client import CloudAMQPClient
import config_reader as reader

config = reader.read_config()
DEDUPE_NEWS_TASK_QUEUE_URL = config.get('PIPELINE', 'DEDUPE_QUEUE_URL')
DEDUPE_NEWS_TASK_QUEUE_NAME = config.get('PIPELINE', 'DEDUPE_QUEUE_NAME')
SCRAPE_NEWS_TASK_QUEUE_URL = config.get('PIPELINE', 'SCRAPE_QUEUE_URL')
SCRAPE_NEWS_TASK_QUEUE_NAME = config.get('PIPELINE','SCRAPE_QUEUE_NAME')

SLEEP_TIME_IN_SECONDS = config.getint('PIPELINE', 'FETCHER_SLEEP_TIME')

dedupe_news_queue_client = CloudAMQPClient(DEDUPE_NEWS_TASK_QUEUE_URL, DEDUPE_NEWS_TASK_QUEUE_NAME)
scrape_news_queue_client = CloudAMQPClient(SCRAPE_NEWS_TASK_QUEUE_URL, SCRAPE_NEWS_TASK_QUEUE_NAME)

def handle_message(message):
    if message is None or not isinstance(message, dict):
        raise ValueError("Message is broken")
    
    task = message
    article = Article(task['url'])
    article.download()
    article.parse()
    # print(article.text.encode('utf-8'))
    task['text'] = article.text

    dedupe_news_queue_client.sendMessage(task)

while True:
    if scrape_news_queue_client is not None:
        msg = scrape_news_queue_client.getMessage()
        if msg is not None:
            try:
                handle_message(msg)
            except Exception as e:
                print(e)
                pass
        scrape_news_queue_client.sleep(SLEEP_TIME_IN_SECONDS)
