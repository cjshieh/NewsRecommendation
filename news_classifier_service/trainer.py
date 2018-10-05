# get some libraries that will be useful
import re
import string
import numpy as np
import pandas as pd

from sklearn.svm import LinearSVC

# function to split the data for cross-validation
from sklearn.model_selection import train_test_split
# function for transforming documents into counts
from sklearn.feature_extraction.text import CountVectorizer
# function for encoding categories
from sklearn.preprocessing import LabelEncoder
import cPickle as pickle


# grab the data
news = pd.read_csv("CleanedNews.csv",encoding='utf8', sep=',', names=['CATEGORY','TITLE','SOURCE'])
print(news.keys())

# pull the data into vectors
vectorizer = CountVectorizer()
x = vectorizer.fit_transform(news['TITLE'])

encoder = LabelEncoder()
y = encoder.fit_transform(news['CATEGORY'])

# split into train and test sets
x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.01)

# take a look at the shape of each of these
print x_train.shape
print y_train.shape
print x_test.shape
print y_test.shape

# nb = MultinomialNB()
nb = LinearSVC()
nb.fit(x_train, y_train)

# Save training results

file = open('news-svm.model','wb')
pickle.dump(nb,file)
file.close()

file = open('news-vectorizer.model','wb')
pickle.dump(vectorizer,file)
file.close()

file = open('news-encoder.model','wb')
pickle.dump(encoder,file)
file.close()


print nb.score(x_test, y_test)


test_topic = 'Jets star Isaiah Crowell wins endorsement deal after being fined by NFL for rubbing football on butt'
test_topic_vector = vectorizer.transform([test_topic.decode('utf-8')]).toarray()

print encoder.inverse_transform(nb.predict(test_topic_vector))[0]
