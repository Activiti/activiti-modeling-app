#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
TARGET=$1

export GIT_HASH=`git rev-parse HEAD`
$DIR/../test-e2e.sh "$@"
