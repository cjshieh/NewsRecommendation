import os
import sys

# import common package in parent directory
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'common'))

import mongodb_client
import classification_service_client

if __name__ == '__main__':
    db = mongodb_client.get_db()
    news_cursor = db['news'].find({})
    count = 0
    for news in news_cursor:
        count += 1
        print count
        print news['_id']
        if 'class' not in news:
            print 'Populating classes...'
            title = news['title']
            description = news['description']
            if description is None:
                description = news['title']
            
            topic = classification_service_client.classifyTopic(title)
            news['class'] = topic
            db['news'].replace_one({'digest': news['digest']}, news, upsert=True)