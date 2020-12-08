#!/usr/bin/env bash

set -e

HOST_PORT=8081
CONTAINER_PORT=8080
docker rmi -f $DOCKER_IMAGE_REPO
docker build --build-arg PROJECT_NAME=$PROJECT_NAME -t $DOCKER_IMAGE_REPO .
echo "http://localhost:${HOST_PORT}${BASE_PATH}"
docker run --rm -it \
  --env BASE_PATH=$BASE_PATH \
  --env IDENTITY_HOST=$IDENTITY_HOST \
  --env OAUTH_HOST=$OAUTH_HOST \
  --user 1000:1000 --publish $HOST_PORT:$CONTAINER_PORT $DOCKER_IMAGE_REPO
