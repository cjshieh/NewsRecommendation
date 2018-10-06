# -*- coding: utf-8 -*-

'''
Time decay model:

If selected:
p = (1-α)p + α

If not:
p = (1-α)p

Where p is the selection probability, and α is the degree of weight decrease.
The result of this is that the nth most recent selection will have a weight of
(1-α)^n. Using a coefficient value of 0.05 as an example, the 10th most recent
selection would only have half the weight of the most recent. Increasing epsilon
would bias towards more recent results more.
'''
import os
import sys

import news_classes
# import common package in parent directory
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'common'))

import mongodb_client
import config_reader as reader
from cloudAMQP_client import CloudAMQPClient


config = reader.read_config()
# Don't modify this value unless you know what you are doing.
NUM_OF_CLASSES = config.getint('PRMODEL', 'NUM_OF_CLASSES')
INITIAL_P = 1.0 / NUM_OF_CLASSES
ALPHA = config.getfloat('PRMODEL', 'ALPHA')

LOG_CLICKS_TASK_QUEUE_URL = config.get('PIPELINE', 'LOG_CLICKS_QUEUE_URL')
LOG_CLICKS_TASK_QUEUE_NAME = config.get('PIPELINE', 'LOG_CLICKS_QUEUE_NAME')
SLEEP_TIME_IN_SECONDS = config.getint('PIPELINE', 'LOG_QUEUE_SLEEP_TIME')

PREFERENCE_MODEL_TABLE_NAME = config.get('PRMODEL', 'PRMODEL_TABLE_NAME')
NEWS_TABLE_NAME = config.get('NEWS', 'NEWS_TABLE_NAME')

cloudAMQP_client = CloudAMQPClient(LOG_CLICKS_TASK_QUEUE_URL, LOG_CLICKS_TASK_QUEUE_NAME)

def handle_message(msg):
    if msg is None or not isinstance(msg, dict) :
        return

    if ('userId' not in msg
        or 'newsId' not in msg
        or 'timestamp' not in msg):
        return

    userId = msg['userId']
    newsId = msg['newsId']

    # Update user's preference
    db = mongodb_client.get_db()
    model = db[PREFERENCE_MODEL_TABLE_NAME].find_one({'userId': userId})

    # If model not exists, create a new one
    if model is None:
        print 'Creating preference model for new user: %s' % userId
        new_model = {'userId' : userId}
        preference = {}
        for i in news_classes.classes:
            preference[i] = float(INITIAL_P)
        new_model['preference'] = preference
        model = new_model

    print 'Updating preference model for new user: %s' % userId

    # Update model using time decaying method
    news = db[NEWS_TABLE_NAME].find_one({'digest': newsId})
    if news is None:
        print 'Retrieved news is none'
        print 'Skipping processing....'
        return
    
    if ( 'class' not in news
        or news['class'] not in news_classes.classes):
        print 'There is no "class" in news or this "class" is not in the category'
        print 'Skipping processing....'
        return

    click_class = news['class']

    # Update the clicked one.
    old_p = model['preference'][click_class]
    model['preference'][click_class] = float((1 - ALPHA) * old_p + ALPHA)

    # Update not clicked classes.
    for i, _prob in model['preference'].iteritems():
        if not i == click_class:
            model['preference'][i] = float((1 - ALPHA) * model['preference'][i])

    db[PREFERENCE_MODEL_TABLE_NAME].replace_one({'userId': userId}, model, upsert=True)

def run():
    while True:
        if cloudAMQP_client is not None:
            msg = cloudAMQP_client.getMessage()
            if msg is not None:
                # Parse and process the task
                try:
                    handle_message(msg)
                except Exception as e:
                    print e
                    pass
            # Remove this if this becomes a bottleneck.
            cloudAMQP_client.sleep(SLEEP_TIME_IN_SECONDS)

if __name__ ==  "__main__":
    run()
