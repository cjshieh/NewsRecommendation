#!/bin/bash
cd backend_service/
python service.py &

cd ../news_classifier_service
python classify_service.py &

cd ../news_recommendation_service
python click_log_processor.py &
python recommend_service.py &

echo "=================================================="
read -p "PRESS [ANY KEY] TO TERMINATE PROCESSES." PRESSKEY

kill $(jobs -p)