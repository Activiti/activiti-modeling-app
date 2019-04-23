## Running e2e tests
End-to-end tests are implemented using **Protractor** and **Jasmine** frameworks.
Tests execution is performed using Angular CLI.

```
$ cd <ama-repo-root>

# run all tests:
npm run e2e

# run single spec file:
npm run e2e -- --specs="./tests/project/delete-project.e2e.ts"

# run suite of specs:
npm run e2e -- --suite=“test”

Note: The suite content (e.g.: test) is defined in protractor.conf.js file.

# End-to-end tests execution in Travis is performed using Environment Variables: **$E2E_SPECS**, respectively **$E2E_SUITE**.
# Variables should be set prior to build execution.
npm run e2e -- --specs="$E2E_SPECS"
npm run e2e -- --suite="$E2E_SUITE"


```

## For Visual Studio Code

```
There are two runners: 
    # E2E - allows single test execution
    # E2Es - allows test suite execution

To run a single test suite is necesary to have the test file opened in a tab. 

```

