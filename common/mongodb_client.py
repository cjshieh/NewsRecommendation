from pymongo import MongoClient
import config_reader as reader

config = reader.read_config()
MONGO_DB_URI = config.get('DB', 'MONGO_DB_URI')
DB_NAME = config.get('DB', 'DB_NAME')

client = MongoClient(MONGO_DB_URI)

def get_db(db=DB_NAME):
    return client[db]