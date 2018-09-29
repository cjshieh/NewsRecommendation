from pymongo import MongoClient
import config_reader as reader

config = reader.read_config()
MONGO_DB_HOST = config['DB']['MONGO_DB_HOST']
MONGO_DB_PORT = config['DB']['MONGO_DB_PORT']
DB_NAME = config['DB']['DB_NAME']

client = MongoClient("%s:%s" % (MONGO_DB_HOST, MONGO_DB_PORT))

def get_db(db=DB_NAME):
    return client[db]