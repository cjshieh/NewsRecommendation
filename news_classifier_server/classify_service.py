# -*- coding: utf-8 -*- 
import numpy as np
import os
import pandas as pd
import pickle
import pyjsonrpc
import re
import string
import sys
import time
from sklearn.naive_bayes import MultinomialNB
from sklearn.svm import LinearSVC
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.preprocessing import LabelEncoder
import cPickle as pickle

import news_classes
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'common'))
import config_reader as reader

config = reader.read_config()
SERVER_HOST = config.get('SERVER', 'SERVER_HOST')
SERVER_PORT = config.getint('SERVER', 'CLASSIFICATION_PORT')

svm = pickle.load( open( "news-svm.model", "rb" ) )
vectorizer = pickle.load( open( "news-vectorizer.model", "rb" ) )
encoder = pickle.load( open( "news-encoder.model", "rb" ) )


def normalize_text(title):
    new_title = title.translate(None, string.punctuation)
    new_title = re.sub(r'\s+',' ',new_title)

    return new_title

class RequestHandler(pyjsonrpc.HttpRequestHandler):
    @pyjsonrpc.rpcmethod
    def classifyTopic(self, text):
        print text
        newsTitle = vectorizer.transform([normalize_text(text).decode("utf8")])
        topicClassIndex = encoder.inverse_transform(svm.predict(newsTitle))[0]   
        
        topic = news_classes.class_map[topicClassIndex]

        return topic


# Threading HTTP-Server
http_server = pyjsonrpc.ThreadingHttpServer(
    server_address = (SERVER_HOST, SERVER_PORT),
    RequestHandlerClass = RequestHandler
)

print "Starting HTTP server on %s:%d" % (SERVER_HOST, SERVER_PORT)

http_server.serve_forever()
