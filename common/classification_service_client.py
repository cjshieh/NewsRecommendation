import pyjsonrpc
import config_reader as reader

config = reader.read_config()
SERVER_HOST = config.get('SERVER', 'SERVER_HOST')
SERVER_PORT = config.get('SERVER', 'CLASSIFICATION_PORT')
SERVER_URL = "http://%s:%s/" % (SERVER_HOST, SERVER_PORT)

client = pyjsonrpc.HttpClient(url=SERVER_URL)

def classifyTopic(title):
    topic = client.call('classifyTopic', title)
    print "The topic is: %s" % str(topic)
    return topic