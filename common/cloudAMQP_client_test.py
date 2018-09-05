from cloudAMQP_client import CloudAMQPClient

CLOUDAMQP_URL = "amqp://zzgxkgkb:m18Sp4SQjW-gG7hui9SyOKnUCg7fgwBu@mustang.rmq.cloudamqp.com/zzgxkgkb"
TEST_QUEUE_NAME = "test"

def test_basic():
    client = CloudAMQPClient(CLOUDAMQP_URL, TEST_QUEUE_NAME)
    
    sentMsg = {"test":"test"}
    client.sendMessage(sentMsg)
    receivedMsg = client.getMessage()

    assert sentMsg == receivedMsg
    print("test_basic passed.")

if __name__ == "__main__":
    test_basic()