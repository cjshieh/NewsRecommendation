import json
import pika

class CloudAMQPClient:
    def __init__(self, cloud_amqp_url, queue_name):
        self.cloud_amqp_url = cloud_amqp_url
        self.queue_name = queue_name
        self.params = pika.URLParameters(cloud_amqp_url)
        self.params._socket_timeout = 3
        # The above setting is for the following code
        self.connection = pika.BlockingConnection(self.params)
        self.channel = self.connection.channel()
        self.channel.queue_declare(queue=queue_name)

    # send a message
    def sendMessage(self, message):
        self.channel.basic_publish(exchange='', 
                                   routing_key=self.queue_name,
                                   body=json.dumps(message))
        print("[x] Sent message to %s: %s" % (self.queue_name, message))
    
    # get a message
    def getMessage(self):
        # check whether the message is empty
        # we need to parse from header
        method_frame, _header_frame, body = self.channel.basic_get(self.queue_name)
        if method_frame:
            print("[x] Received message from %s: %s" % (self.queue_name, body))
            # delivery_tag to prevent others deliberatly remove queue
            self.channel.basic_ack(method_frame.delivery_tag)
            return json.loads(body)
        else:
            print("No message returned.")
            # Same as return null
            return None

    # Herat rate to check whether producer and consumer is still alive
    # BlockingConnection.sleep is a safer way to sleep than time.sleep()
    def sleep(self, seconds):
        self.connection.sleep(seconds)