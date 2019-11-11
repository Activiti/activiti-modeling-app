#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

if [ -z $ADF_PATH ]; then
    echo -e "\e[31mError: ADF_PATH environment variable is not set! Abort starting. \e[0m"
    exit 1;
fi

# This one is needed for scss-bundle
if [ ! -d "$ADF_PATH/node_modules/@angular/material" ]; then
    echo "node_modules does not exists in $ADF_PATH, running 'npm install @angular/material'"
    sh -c "cd $ADF_PATH && npm install @angular/material"
fi

sed \
    -e "s%../node_modules/@alfresco/adf-core%$ADF_PATH/lib/core%"\
    -e "s%../node_modules/@alfresco/adf-extensions%$ADF_PATH/lib/extensions%"\
    ./src/tsconfig.app.json > ./src/tsconfig.adfdev.json

scss-bundle --project "$DIR" -e $ADF_PATH/lib/core/styles/_index.scss --rootDir $ADF_PATH || exit 1;

concurrently --success first \
    "scss-bundle --project $DIR -e $ADF_PATH/lib/core/styles/_index.scss --rootDir $ADF_PATH -w"\
    "node node_modules/webpack/bin/webpack.js --config $DIR/webpack.style.js --progress --profile --bail --watch"\
    "node $DIR/dev-copy-watch.js"\
    "ng serve --configuration=adfdev --open"
