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
    
    """ Get news summaries for a user """
    @pyjsonrpc.rpcmethod
    def getNewsSummariesForUser(self, user_id, page_num):
        print "load news is called %s and %s" % (user_id, page_num)
        return operations.getNewsSummariesForUser(user_id, page_num)

http_server = pyjsonrpc.ThreadingHttpServer(
    server_address = (SERVER_HOST, SERVER_PORT),
    RequestHandlerClass = RequestHandler
)

print "Starting HTTP server on %s:%d" % (SERVER_HOST, SERVER_PORT)

http_server.serve_forever()