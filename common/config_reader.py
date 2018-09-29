import configparser
import inspect
import os
import sys

currentdir = os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))
parentdir = os.path.dirname(currentdir)

def read_config():
    fileName = os.path.join(parentdir, "server_config.ini")

    if(sys.version_info[0] < 3): 
        import ConfigParser
        config = ConfigParser.ConfigParser()
        config.read(fileName)
        return config
    

    config = configparser.ConfigParser()
    config.read(fileName)

    return config
