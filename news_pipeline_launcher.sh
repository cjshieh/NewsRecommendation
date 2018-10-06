#!/bin/bash
# Start redis and mongoDB
# redis-server /usr/local/etc/redis.conf
# mongod --dbpath ~/data/db

# install requirements
sudo python3 -m pip install -r requirements.txt

# run newspipeline
cd news_pipline
python news_monitor.py &
python3 news_fetcher.py &
python news_deduper.py &

echo "=================================================="
read -p "PRESS [ANY KEY] TO TERMINATE PROCESSES." PRESSKEY

kill $(jobs -p)