#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd "$DIR/../"
BROWSER_RUN=false
DEVELOPMENT=false

show_help() {
    echo "Usage: ./scripts/test-e2e-ama.sh -host ama.domain.com -u admin -p admin"
    echo ""
    echo "-u or --username"
    echo "-p or --password"
    echo "-uu or --unauthorized-user",
    echo "-uupwd or --unauthorized-user-password",
    echo "-e or --email"
    echo "-b or --browser run the test in the browsrwer (No headless mode)"
    echo "-s or --specs run a single test file"
    echo "-su or --suite run a suite of tests"
    echo "-f or --folder run a single folder test"
    echo "-proxy or --proxy proxy Back end URL to use only possible to use with -dev option"
    echo "-dev or --dev run it against local development environment it will deploy on localhost:4200 the current version of your branch"
    echo "-host or --host URL of the Front end to test"
    echo "-port or --port Port number of the Front end to test"
    echo "-save save the error screenshot in the remote env"
    echo "-sh-url server url to save screenshots to"
    echo "-sh-user username for server to save screenshots to"
    echo "-sh-pass password for server to save screenshots to"
    echo "-timeout or --timeout override the timeout foe the wait utils"
    echo "-h or --help"
}

set_username(){
    USERNAME=$1
}

set_password(){
    PASSWORD=$1
}

set_screenshot_url(){
    SCREENSHOT_URL=$1
}

set_screenshot_username(){
    SCREENSHOT_USERNAME=$1
}

set_screenshot_password(){
    SCREENSHOT_PASSWORD=$1
}

set_unauth_user(){
    UNAUTHORIZED_USER=$1
}

set_unauth_user_password(){
    UNAUTHORIZED_USER_PASSWORD=$1
}

set_email(){
    EMAIL=$1
}

set_host(){
    HOST=$1
}

set_port(){
    PORT=$1
}

set_test(){
    SINGLE_TEST=true
    NAME_TEST=$1
}

set_suite(){
    SUITE=$1
}

set_browser(){
    echo "====== BROWSER RUN ====="
    BROWSER_RUN=true
}

set_proxy(){
    PROXY=$1
}

set_timeout(){
    TIMEOUT=$1
}

set_save_screenshot(){
    SAVE_SCREENSHOT="true"
}

set_development(){
    DEVELOPMENT=true
}

set_test_folder(){
    FOLDER=$1
}

while [[ $1 == -* ]]; do
    case "$1" in
      -h|--help|-\?) show_help; exit 0;;
      -u|--username)  set_username $2; shift 2;;
      -p|--password)  set_password $2; shift 2;;
      -uu|--unauthorized-user)  set_unauth_user $2; shift 2;;
      -uupwd|--unauthorized-user-password)  set_unauth_user_password $2; shift 2;;
      -e|--email)  set_email $2; shift 2;;
      -f|--folder)  set_test_folder $2; shift 2;;
      -timeout|--timeout)  set_timeout $2; shift 2;;
      -b|--browser)  set_browser; shift;;
      -dev|--dev)  set_development; shift;;
      -s|--specs)  set_test $2; shift 2;;
      -su|--suite)  set_suite $2; shift 2;;
      -save)   set_save_screenshot; shift;;
      -sh-url)   set_screenshot_url $2; shift 2;;
      -sh-user)   set_screenshot_username $2; shift 2;;
      -sh-pass)   set_screenshot_password $2; shift 2;;
      -proxy|--proxy)  set_proxy $2; shift 2;;
      -host|--host)  set_host $2; shift 2;;
      -port|--port)  set_port $2; shift 2;;
      -*) echo "invalid option: $1" 1>&2; show_help; exit 1;;
    esac
done

rm -rf ./e2e-output/

export URL_HOST_AMA=$HOST
export AMA_PORT=$PORT
export E2E_USERNAME=$USERNAME
export E2E_PASSWORD=$PASSWORD
export E2E_UNAUTHORIZED_USER=$UNAUTHORIZED_USER
export E2E_UNAUTHORIZED_USER_PASSWORD=$UNAUTHORIZED_USER_PASSWORD
export EMAIL=$EMAIL
export BROWSER_RUN=$BROWSER_RUN
export PROXY_HOST_AMA=$PROXY
export SAVE_SCREENSHOT=$SAVE_SCREENSHOT
export SCREENSHOT_URL=$SCREENSHOT_URL
export SCREENSHOT_USERNAME=$SCREENSHOT_USERNAME
export SCREENSHOT_PASSWORD=$SCREENSHOT_PASSWORD
export TIMEOUT=$TIMEOUT
export FOLDER=$FOLDER'/'

echo "====== Update webdriver-manager ====="
./node_modules/protractor/bin/webdriver-manager update --gecko=false

if [[  $DEVELOPMENT == "true" ]]; then
  echo "====== Run against local development  ====="
  if [[  $SINGLE_TEST == "true" ]]; then
    echo "====== Single test run $NAME_TEST ====="
    npm run e2e -- --specs $NAME_TEST || exit 1
  else
    npm run e2e || exit 1
  fi
else
  if [[  $SINGLE_TEST == "true" ]]; then
    echo "====== Run single test: $NAME_TEST ====="
     ./node_modules/protractor/bin/protractor ./e2e/protractor.conf.js --specs=$NAME_TEST || exit 1
  else
    if [[  $SUITE  ]]; then
        echo "====== Run suite: $SUITE ====="
        ./node_modules/protractor/bin/protractor ./e2e/protractor.conf.js --suite=$SUITE || exit 1
    else
        echo "====== Run all tests  ====="
        ./node_modules/protractor/bin/protractor ./e2e/protractor.conf.js || exit 1
    fi
  fi
fi
