import pyjsonrpc
import config_reader as reader

config = reader.read_config()
SERVER_HOST = config.get('SERVER', 'SERVER_HOST')
SERVER_PORT = config.get('SERVER', 'RECOMMENDATION_PORT')
SERVER_URL = "http://%s:%s/" % (SERVER_HOST, SERVER_PORT)

client = pyjsonrpc.HttpClient(url=SERVER_URL)

def getPreferenceForUser(userId):
    preference = client.call('getPreferenceForUser', userId)
    print "Preference list: %s" % str(preference)
    return preference
