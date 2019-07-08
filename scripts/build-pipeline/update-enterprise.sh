#!/usr/bin/env bash

PACKAGE_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
EE_REPO_DIR="$PACKAGE_DIR/../.ee_repo"
BRANCH_TO_CREATE=""
COMMITISH_TO_UPDATE_TO=""
TOKEN=""
NAME_REPO=""

show_help() {
    echo "Usage: update-enterprise.sh"
    echo ""
    echo "-b or -branch: Create branch if not exists where to update the commitish of activiti"
    echo "-c or -commitish: The commitish to update activiti to"
    echo "-t or --token: Github ouath token"
    echo "-n or --name: Github name of the project"
}

set_branch() {
    echo "Branch: $1"
    BRANCH_TO_CREATE=$1
}

set_commitish() {
    echo "Commitish: $1"
    COMMITISH_TO_UPDATE_TO=$1
}

set_token() {
    TOKEN=$1
}

name_repo() {
    NAME_REPO=$1
}

while [[ $1 == -* ]]; do
    case "$1" in
      -h|--help|-\?) show_help; exit 0;;
      -b|--branch) set_branch $2; shift; shift;;
      -c|--commitish) set_commitish $2; shift; shift;;
      -n|--name) name_repo $2; shift; shift;;
      -t|--token) set_token $2; shift; shift;;
      -*) echo "invalid option: $1" 1>&2; show_help; exit 1;;
    esac
done

if [[ (-z "$BRANCH_TO_CREATE") || (-z "$COMMITISH_TO_UPDATE_TO") || (-z "$TOKEN") || (-z "$NAME_REPO") ]]
  then
    echo "Each of 'branch name' (-b), 'commitish' (-c), repo's name (-n) and token (-t) have to be set. See -help."
    exit 1;
fi

rm -rf $EE_REPO_DIR;

git clone https://$TOKEN@github.com/$NAME_REPO.git $EE_REPO_DIR
cd $EE_REPO_DIR
git checkout development

$EE_REPO_DIR/scripts/build-pipeline/create-updatebranch.sh -b $BRANCH_TO_CREATE -c $COMMITISH_TO_UPDATE_TO -t $TOKEN -p $TRAVIS_PULL_REQUEST

exit 0;
