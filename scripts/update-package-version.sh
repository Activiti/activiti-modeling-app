#!/usr/bin/env bash

PACKAGE_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
VERSION=$1

eval packages=(
    "$PACKAGE_DIR"
    "$PACKAGE_DIR/projects/ama-sdk"
    "$PACKAGE_DIR/projects/ama-testing"
)
packagesLength=${#packages[@]}

for (( j=0; j<${packagesLength}; j++ ));
    do
        PACKAGE_PATH="${packages[$j]}"
        echo "====== UPDATE PACKAGE VERSION of ${packages[$j]} to ${VERSION} ======"
        cd $PACKAGE_PATH;
        npm version --no-git-tag-version --force $VERSION
    done
