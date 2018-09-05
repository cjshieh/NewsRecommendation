import requests

from json import loads

NEWS_API_PREFIX = 'https://newsapi.org/v2/'
NEW_API_KEY = 'e847d9e615e644ad91b077336c66493c'

TOP_NEWS_API = 'top-headlines'

BBC_NEWS = 'bbc-news'
BBC_SPORT = 'bbc-sport'
CNN = 'cnn'

DEFAULT_SOURECES = [CNN, BBC_NEWS]

def concatSources(sources):
    return ','.join(sources) 

def buildURL(endPoint=NEWS_API_PREFIX, apiMethod=TOP_NEWS_API):
    return endPoint + apiMethod

def getNewsFromSource(sources=DEFAULT_SOURECES):
    acticles = []

    payload = {
        'apiKey': NEW_API_KEY,
        'sources': concatSources(sources),
        'pageSize': '100'
    }
    response = requests.get(buildURL(), params=payload)
    res_json = loads(response.content)

    # Extract info from response
    if (res_json is not None and 
        res_json['status'] == 'ok'):

        acticles.extend(res_json['articles'])
    
    return acticles
        