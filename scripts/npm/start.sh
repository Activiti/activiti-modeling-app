#!/usr/bin/env bash
TARGET=$1

rimraf dist
ajv validate -s ./node_modules/@alfresco/adf-core/app.config.schema.json -d ./src/app.config.json --errors=text --verbose

if [[  $TARGET == "prod" ]]; then
    echo -e " \e[31mStarting app in production mode...\e[0m"
    ng serve dist --prod --host 0.0.0.0 --disable-host-check
elif [[  $TARGET == "adfdev" ]]; then
    rimraf ../../../alfresco-ng2-components/lib/node_modules/@angular
    concurrently --success first \
        "ng serve adfdev --host 0.0.0.0 --disable-host-check --open"\
        "node node_modules/webpack/bin/webpack.js --config config/webpack.style.js --progress --profile --bail --watch"\
        "node ./config/dev-copy-watch.js"
else
    echo -e "\e[32mStarting app in debug mode\e[0m"
    ng serve dist --host 0.0.0.0 --open
fi
