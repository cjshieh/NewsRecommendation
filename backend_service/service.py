import os
import sys

import operations
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'common'))
import config_reader as reader
import pyjsonrpc

config = reader.read_config()
SERVER_HOST = config.get('SERVER', 'SERVER_HOST')
SERVER_PORT = config.getint('SERVER', 'SERVER_PORT')

class RequestHandler(pyjsonrpc.HttpRequestHandler):
    # Test method
    @pyjsonrpc.rpcmethod
    def add(self, a, b):
        print "add is call with %d and %d" % (a, b)
        return a + b
    
    """ Get part news for anyone """
    @pyjsonrpc.rpcmethod
    def getNewsDefault(self):
        return operations.getNewsDefault()

    """ Get news summaries for a user """
    @pyjsonrpc.rpcmethod
    def getNewsSummariesForUser(self, user_id, page_num):
        return operations.getNewsSummariesForUser(user_id, page_num)
    
    """ Get news summaries from search key """
    @pyjsonrpc.rpcmethod
    def getNewsFromSearchKey(self, query, page_num):
        return operations.getNewsFromSearchKey(query, page_num)
    
    """ Store user behavior """
    @pyjsonrpc.rpcmethod
    def logNewsClickForUser(self, user_id, news_id):
        print "Store behavior is called %s and %s" % (user_id, news_id)
        return operations.logNewsClickForUser(user_id, news_id)

http_server = pyjsonrpc.ThreadingHttpServer(
    server_address = (SERVER_HOST, SERVER_PORT),
    RequestHandlerClass = RequestHandler
)

print "Starting HTTP server on %s:%d" % (SERVER_HOST, SERVER_PORT)

http_server.serve_forever()