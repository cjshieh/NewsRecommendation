
import news_api_client as client


def test_basic():
    news = client.getNewsFromSource()
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
    print(news)
    assert len(news) > 0
    news = client.getNewsFromSource(sources=NEWS_SOURCES)
    assert len(news) > 0
    print('[x] test basic new_api passed!')


if __name__ == "__main__":
    test_basic()
