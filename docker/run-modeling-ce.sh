#!/usr/bin/env bash

set -e

[[ "$BUILD_ENABLED" == "true" ]] && $(dirname $0)/build.sh modeling-ce

env \
  PROJECT_NAME=modeling-ce \
  BASE_PATH=${BASE_PATH:-/modeling} \
  DOCKER_IMAGE_REPO=activiti/activiti-cloud-modeling \
  $(dirname $0)/run.sh
