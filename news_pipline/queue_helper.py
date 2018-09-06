import os
import sys

# import common package in parent directory
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'common'))

import news_api_client
from cloudAMQP_client import CloudAMQPClient

# TODO: use your own queue.
DEDUPE_NEWS_TASK_QUEUE_URL = "amqp://cmqvlnlz:ssjlNafwRdnv-jw4s7l8JGviXstC3g1u@dinosaur.rmq.cloudamqp.com/cmqvlnlz"
DEDUPE_NEWS_TASK_QUEUE_NAME = "dedup_news_task"
SCRAPE_NEWS_TASK_QUEUE_URL = "amqp://rurhenzz:d-baqsTGTIHBRBcJONCV31w5Lu_Byl7N@dinosaur.rmq.cloudamqp.com/rurhenzz"
SCRAPE_NEWS_TASK_QUEUE_NAME = "scrape_news_task"

def clearQueue(queue_url, queue_name):
    scrape_news_queue_client = CloudAMQPClient(queue_url, queue_name)

    num_of_messages = 0

    while True:
        if scrape_news_queue_client is not None:
            msg = scrape_news_queue_client.getMessage()
            if msg is None:
                print ("Cleared %d messages." % num_of_messages)
                return
            num_of_messages += 1


if __name__ == "__main__":
    clearQueue(SCRAPE_NEWS_TASK_QUEUE_URL, SCRAPE_NEWS_TASK_QUEUE_NAME)
    clearQueue(DEDUPE_NEWS_TASK_QUEUE_URL, DEDUPE_NEWS_TASK_QUEUE_NAME)