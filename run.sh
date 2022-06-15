#!/bin/bash

NAME=intronet

docker build -t $NAME .
docker rm -f $NAME
docker run --restart=always -d -p 4000:80 --name $NAME $NAME
