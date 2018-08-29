import pyjsonrpc

SERVER_HOST = 'localhost'
SERVER_PORT = 8080 

class RequestHandler(pyjsonrpc.HttpRequestHandler):
    # Test method
    @pyjsonrpc.rpcmethod
    def add(self, a, b):
        print "add is call with %d and %d" % (a, b)
        return a + b

http_server = pyjsonrpc.ThreadingHttpServer(
    server_address = ('localhost', 8080),
    RequestHandlerClass = RequestHandler
)

print "Starting HTTP server on %s:%d" % (SERVER_HOST, SERVER_PORT)

http_server.serve_forever()