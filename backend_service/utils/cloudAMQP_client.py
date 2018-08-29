import json
import pika

# Why we define cloudAMQP as a class?
# We don't communicate with one AMQP. 
# It is possible that amqp will communicate with others queue
# So we define as class and others AMQP can instantiate a object
class CloudAMQPClient:
    def __init__(self, cloud_amqp_url, queue_name):
        self.cloud_amqp_url = cloud_amqp_url
        self.queue_name = queue_name
        # 
        self.params = pika.URLParameters(cloud_amqp_url)
        self.params._socket_timeout = 3
        self.connection = pika.BlockingConnection(self.params)
        self.channel = self.connection.channel()
        self.channel.queue_declare(queue=queue_name)
