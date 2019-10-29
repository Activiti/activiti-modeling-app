#!/usr/bin/env bash
TARGET=$1

export GIT_HASH=`git rev-parse HEAD`
./scripts/test-e2e.sh "$@"
