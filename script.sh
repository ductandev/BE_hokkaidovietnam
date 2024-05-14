#!/bin/bash
start=$(date +'%s')
echo "Begin!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
echo "Begin install systems"

sudo docker rm -f cons-fe-hokkaido
sudo docker rmi -f img-fe-hokkaido
sudo docker build . -t img-fe-hokkaido
sudo docker run -d -p 3100:80 --name cons-fe-hokkaido img-fe-hokkaido


echo "bat dau thoi gian:$start"
end=$(date +'%s')
echo "ket thuc thoi gian:$end"

