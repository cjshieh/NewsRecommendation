import datetime
import inspect
import os
import sys

from dateutil import parser
from sklearn.feature_extraction.text import TfidfVectorizer

currentdir = os.path.dirname(os.path.abspath(
    inspect.getfile(inspect.currentframe())))
parentdir = os.path.dirname(currentdir)
sys.path.append(os.path.join(parentdir, "common"))

from cloudAMQP_client import CloudAMQPClient
import config_reader as reader
import mongodb_client

config = reader.read_config()
DEDUPE_NEWS_TASK_QUEUE_URL = config['PIPELINE']['DEDUPE_QUEUE_URL']
DEDUPE_NEWS_TASK_QUEUE_NAME = config['PIPELINE']['DEDUPE_QUEUE_NAME']
SAME_NEWS_SIMILARITY_THRESHOLD = config.getfloat('PIPELINE', 'NEWS_SIMILARITY_THRESHOLD')
SLEEP_TIME_IN_SECONDS = config.getint('PIPELINE', 'DEDUPER_SLEEP_TIME')
NEWS_TABLE_NAME = "news-category"
# NEWS_TABLE_NAME = "news"

cloudAMQP_client = CloudAMQPClient(
    DEDUPE_NEWS_TASK_QUEUE_URL, DEDUPE_NEWS_TASK_QUEUE_NAME)


def setPeriodOfTime(published_at, periodDays=1):
    # published_at = parser.parse(task['publishedAt'])
    published_at_day_begin = datetime.datetime(
        published_at.year, published_at.month, published_at.day, 0, 0, 0, 0)
    published_at_day_end = published_at_day_begin + \
        datetime.timedelta(days=periodDays)
    return published_at_day_begin, published_at_day_end

def handle_message(msg):
    if msg is None or not isinstance(msg, dict):
        raise ValueError("Message is broken")

    task = msg
    text = task['text']
    if text is None:
        raise ValueError("Message with empty text")
    published_at_day_begin, published_at_day_end = setPeriodOfTime(
        parser.parse(task['publishedAt']))
    

    db = mongodb_client.get_db()
    news_list = list(db[NEWS_TABLE_NAME].find(
        {'publishedAt': {'$gte': published_at_day_begin,
                         '$lt': published_at_day_end}}))

    if news_list is not None and len(news_list) > 0:
        documents = [news['text'] for news in news_list]
        documents.insert(0, text)
        # doing cosine silimarity
        tfidf = TfidfVectorizer().fit_transform(documents)
        pairwise_sim = tfidf * tfidf.T

        print(pairwise_sim)

        rows, _ = pairwise_sim.shape
        for row in range(1, rows):
            if pairwise_sim[row, 0] > SAME_NEWS_SIMILARITY_THRESHOLD:
                print("Duplicated news. Ignore.")
                return

    task['publishedAt'] = parser.parse(task['publishedAt'])
    db[NEWS_TABLE_NAME].replace_one(
        {'digest': task['digest']}, task, upsert=True)


while True:
    if cloudAMQP_client is not None:
        msg = cloudAMQP_client.getMessage()
        if msg is not None:
            # Parse and process the task
            try:
                handle_message(msg)
            except Exception as e:
                print(e)
                pass
        cloudAMQP_client.sleep(SLEEP_TIME_IN_SECONDS)
