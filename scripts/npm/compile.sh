#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ACTION=$1
TARGET=$2

rimraf dist lib
ajv validate -s ./node_modules/@alfresco/adf-core/app.config.schema.json -d ./src/app.config.json --errors=text --verbose

if [ -f "./.env" ]; then
    export $(cat .env | xargs)
fi

if [ "$ACTION" == "build" ]; then
    $DIR/_build.sh $TARGET
elif [ "$ACTION" == "start" ]; then
    $DIR/_start.sh $TARGET
fi
