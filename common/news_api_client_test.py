
import news_api_client as client 

def test_basic():
    news = client.getNewsFromSource()
    print news
    assert len(news) > 0
    news = client.getNewsFromSource(sources=['cnn', 'bbc-sport', 'bbc-news'])
    assert len(news) > 0
    print '[x] test basic new_api passed!'

if __name__ == "__main__":
    test_basic()
