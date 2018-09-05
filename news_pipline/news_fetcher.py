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

DEDUPE_NEWS_TASK_QUEUE_URL = "amqp://cmqvlnlz:ssjlNafwRdnv-jw4s7l8JGviXstC3g1u@dinosaur.rmq.cloudamqp.com/cmqvlnlz"
DEDUPE_NEWS_TASK_QUEUE_NAME = "dedup_news_task"
SCRAPE_NEWS_TASK_QUEUE_URL = "amqp://rurhenzz:d-baqsTGTIHBRBcJONCV31w5Lu_Byl7N@dinosaur.rmq.cloudamqp.com/rurhenzz"
SCRAPE_NEWS_TASK_QUEUE_NAME = "scrape_news_task"

SLEEP_TIME_IN_SECONDS = 5

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
