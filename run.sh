#!/bin/bash

NAME=intronet-front

docker build -t $NAME .
docker rm -f $NAME
docker run --network=apps --restart=always -d -p 4000:80 --name $NAME $NAME
