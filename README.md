# Activiti Modeling Application

| master | [![Build Status](https://travis-ci.org/Activiti/activiti-modeling-app.svg?branch=master)](https://travis-ci.org/Activiti/activiti-modeling-app) |
| - | - |

<p align="center">
    <img title="Activiti" width="250px" src="activiti.png" alt="Activiti">
</p>

## Introduction

The Activiti Modeling Application (AMA) is an application built using
[Alfresco Application Development Framework (ADF)](https://github.com/Alfresco/alfresco-ng2-components) components and was generated with [Angular CLI](https://github.com/angular/angular-cli).

---

## Installing dependencies

```bash
$ npm install
```

---

## Prerequisites

To be able to run the local dev server, you need to set some environment variable. Simply crete a `.env` file (this is gitignored) in the root of the repository with filling in the following data:

```bash
ADF_PATH="<path to local alfresco-ng2-components repository>"
API_HOST="http://my-acm.implementation.com"
OAUTH_HOST="http://my-acm.implementation.com/auth/realms/whatever"
E2E_HOST="http://localhost:4200"
E2E_USERNAME=""
E2E_PASSWORD=""
E2E_UNAUTHORIZED_USER=""
E2E_UNAUTHORIZED_USER_PASSWORD=""
BROWSER_RUN="true"
SAVE_SCREENSHOT="true"
SCREENSHOT_URL=""
SCREENSHOT_USERNAME=""
SCREENSHOT_PASSWORD=""
LOG=true
```

---


## Running the application


```bash
# Development server
$ npm start
```

```bash
# Production server
$ npm run start prod
```

```bash
# Development server with local ADF components
$ npm run start adfdev
```

Run the script above for the development server using the local ADF components. For this to work properly you must have to chek out the [Alfresco Application Development Framework (ADF)](https://github.com/Alfresco/alfresco-ng2-components) and set the `ADF_PATH` as an environment variable or in your .env file.

---

## Building the application

```bash
# Development build
$ npm run build
```

```bash
# Production build
$ npm run build prod
```

```bash
# Development build with local ADF components
$ npm run build adfdev
```

---

## Running unit tests

```bash
# Test runner command in CI
$ npm run test
```


```bash
# Test runner command with desktop notifications
$ npm run test dev
```


```bash
# Test runner command in watch mode with desktop notifications
$ npm run test watch
```

Run the script above to execute the unit tests via [Jest](https://jestjs.io/).

---

## Running E2E tests

For this to run properly, please see the prerequisites section above.

```bash
# run all tests:
npm run e2e

# run single spec file:
npm run e2e -- --specs="./tests/project/delete-project.e2e.ts"

# run suite of specs:
npm run e2e -- --suite=“test”

Note: The suite content (e.g.: test) is defined in protractor.conf.js file.
```

### E2E VSCode launchers

There are two runners:
- E2E - allows single test execution
- E2Es - allows test suite execution

To run a single test suite is necesary to have the test file opened in a tab.

---

### Running in Docker

First build the application as above.

Then `docker build . -t alfresco/alfresco-modeler-app:latest` to build the image

Start with below (substituting with values for your deployment):

`docker run -it -e APP_CONFIG_OAUTH2_HOST="http://KEYCLOAKHOST/auth/realms/activiti" -e APP_CONFIG_OAUTH2_CLIENTID="activiti" -e APP_CONFIG_BPM_HOST="http://GATEWAYHOST" -p 8080:80 alfresco/alfresco-modeling-app:latest`

If any substitutions don't work then check that the placeholders in `docker-entrypoint.sh` match `src/app.config.json`

---

## Browser Support

The application is supported in the following browsers:

| **Browser**   | **Version** |
| ------------- | ----------- |
| Chrome        | Latest      |
| Safari (OS X) | 9.x         |
| Firefox\*     | Latest      |
| Edge          | 13, 14      |
