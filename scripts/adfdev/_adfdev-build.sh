#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

if [ -z $ADF_PATH ]; then
    echo -e "\e[31mError: ADF_PATH environment variable is not set! Abort building. \e[0m"
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
    -e "s%../node_modules/@alfresco/adf-content-services%$ADF_PATH/lib/content-services%"\
    -e "s%../node_modules/@alfresco/adf-process-services-cloud%$ADF_PATH/lib/process-services-cloud%"\
    ./src/tsconfig.app.json > ./src/tsconfig.adfdev.json

scss-bundle --project "$DIR" -e $ADF_PATH/lib/core/styles/_index.scss --rootDir $ADF_PATH || exit 1;
webpack --config "$DIR/webpack.style.js" --progress --profile --bail || exit 1;

ng build --configuration=adfdev "$@"
