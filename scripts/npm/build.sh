#!/usr/bin/env bash
TARGET=$1

rimraf dist
ajv validate -s ./node_modules/@alfresco/adf-core/app.config.schema.json -d ./src/app.config.json --errors=text --verbose

if [[  $TARGET == "prod" ]]; then
    echo -e " \e[31mBuilding app in production mode\e[0m"
    ng build dist --prod
elif [[  $TARGET == "adfdev" ]]; then
    echo -e "\e[33mBuilding app using local adf\e[0m"
    node node_modules/webpack/bin/webpack.js --config  config/webpack.style.js --progress --profile --bail
    ng build adfdev
else
    echo -e "\e[32mBuilding app in debug mode\e[0m"
    ng build dist
fi
