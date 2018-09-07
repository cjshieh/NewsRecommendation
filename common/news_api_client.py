import requests

from json import loads
import math

NEWS_API_PREFIX = 'https://newsapi.org/v2/'
NEW_API_KEY = 'e847d9e615e644ad91b077336c66493c'
NEWS_PER_PAGE = 100
PAGE_START = 1
LIMITS_OF_PAGES = 100
TOP_NEWS_API = 'top-headlines'

BBC_NEWS = 'bbc-news'
BBC_SPORT = 'bbc-sport'
CNN = 'cnn'

DEFAULT_SOURECES = [CNN, BBC_NEWS]
DEFAULT_CATEGORY = ['business']
COUNTRY = 'us'


def concatSources(sources):
    return ','.join(sources)


def buildURL(endPoint=NEWS_API_PREFIX, apiMethod=TOP_NEWS_API):
    return endPoint + apiMethod


def extractMoreNews(article, url, payload, number_of_result):
    totalPages = math.ceil(number_of_result / NEWS_PER_PAGE)
    totalPages = LIMITS_OF_PAGES if totalPages > LIMITS_OF_PAGES else totalPages
    for page in range(PAGE_START, totalPages+1):
        payload['page'] = str(page)
        res_json, goodToProcess = requestFromUrl(url, payload)
        if(goodToProcess):
            article.extend(res_json['articles'])


def requestFromUrl(url, payload):
    response = requests.get(url, params=payload)
    res_json = loads(response.content)
    goodToProcess = False
    if (res_json is not None and
            res_json['status'] == 'ok'):
        goodToProcess = True
    return res_json, goodToProcess


def getNewsFromSource(sources=DEFAULT_SOURECES):
    acticles = []
    sourceURL = buildURL()
    allSources = concatSources(sources)
    payload = {
        'apiKey': NEW_API_KEY,
        'sources': allSources,
        'pageSize': str(NEWS_PER_PAGE),
        'page': str(PAGE_START)
    }

    res_json, goodToProcess = requestFromUrl(sourceURL, payload)
    # Extract info from response
    if(goodToProcess):
        if res_json['totalResults'] > NEWS_PER_PAGE:
            extractMoreNews(acticles, sourceURL, payload,
                            res_json['totalResults'])
        else:
            acticles.extend(res_json['articles'])

    return acticles


def getNewsFromCategory(categories=DEFAULT_CATEGORY):
    def addAttributeToAll(articles, category):
        for article in articles:
            article['category'] = category

    acticles = []
    sourceURL = buildURL()
    for category in categories:
        payload = {
            'apiKey': NEW_API_KEY,
            'category': category,
            'country': COUNTRY,
            'pageSize': str(NEWS_PER_PAGE)
        }

        res_json, goodToProcess = requestFromUrl(sourceURL, payload)
        if(goodToProcess):
            addAttributeToAll(res_json['articles'], category)
            acticles.extend(res_json['articles'])

    return acticles
