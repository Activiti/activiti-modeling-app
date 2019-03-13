## Running e2e tests
End-to-end tests are implemented using **Protractor** and **Jasmine** frameworks. Tests execution is performed using a shell script.

```
$ cd <ama-repo-root>

# run all tests:
$ ./scripts/test-e2e-ama.sh \
-host <host | e.g.: localhost> \
-port <port | e.g.: 4300> \
-u <username | e.g.: admin> \
-p <password | e.g.: admin> \
--proxy <proxy | e.g.: localhost:8080> \
-b # For running it in chrome instead of headless browser \
-dev # For starting the dev server also (otherwise the server needs to be running)

# run single test:
./scripts/test-e2e-ama.sh -host <hostname> -port <port> -u <username> -p <password> -b -s <path-to-test-file>


To run the tests after a fresh npm install, execute next command:
`./node_modules/protractor/bin/webdriver-manager update --gecko=false`

Note:  **path-to-test-file** is the test file relative path to the current execution directory and it includes the test name (e.g.: ./e2e/tests/process/create-process.e2e.ts) 

```

## For Visual Studio Code

```
There are two runners: 
    # E2E - allows single test execution
    # E2Es - allows test suite execution

To run a single test suite is necesary to have the test file opened in a tab. 

```

