#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
. $DIR/helpers/_show-header.sh
TARGET=$1

show_header "starting" $TARGET

cp ./src/app.config.json ./src/.app.config.json
node "$DIR/../app-config-replace.js" --config="./src/.app.config.json" -oi

if [ "$TARGET" == "prod" ]; then
    NODE_OPTIONS=${NODE_OPTIONS:-" --max_old_space_size=30000 "}
    node ${NODE_OPTIONS} ./node_modules/@angular/cli/bin/ng serve --prod --open
elif [ "$TARGET" == "adfdev" ]; then
    $DIR/../adfdev/_adfdev-start.sh
else
    ng serve --open
fi
