import operations
import os
import sys

# import common package in parent directory
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'common'))

import mongodb_client

"""Start Redis and MongoDB before runnning following tests."""

def test_getNewsSummariesForUser_basic():
    news = operations.getNewsSummariesForUser('test', 1)
    print(news)
    assert len(news) > 0
    print 'test_getNewsSummariesForUser_basic passed!'


def test_getNewsSummariesForUser_pagination():
    news_page_1 = operations.getNewsSummariesForUser('test', 1)
    news_page_2 = operations.getNewsSummariesForUser('test', 2)

    assert len(news_page_1) > 0
    assert len(news_page_2) > 0

    # Assert that there is no dupe news in two pages.
    digests_page_1_set = set([news['digest'] for news in news_page_1])
    digests_page_2_set = set([news['digest'] for news in news_page_2])
    assert len(digests_page_1_set.intersection(digests_page_2_set)) == 0

    print 'test_getNewsSummariesForUser_pagination passed!'

def test_getNewsFromSearchKey():
    news = operations.getNewsFromSearchKey('trump', 1)

    assert len(news) > 0
    assert 'class' in news[0]

    print 'test_getNewsFromSearchKey passed!'

if __name__ == "__main__":
    test_getNewsSummariesForUser_basic()
    test_getNewsFromSearchKey()
    # test_getNewsSummariesForUser_pagination()