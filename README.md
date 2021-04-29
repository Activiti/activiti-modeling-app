# Activiti Modeling Application

| master | [![Build Status](https://travis-ci.org/Activiti/activiti-modeling-app.svg?branch=master)](https://travis-ci.org/Activiti/activiti-modeling-app) |
| - | - |

<p align="center">
    <img title="Activiti" width="250px" src="./app/src/assets/activiti.png" alt="Activiti">
</p>

## Introduction

The Alfresco Modeling Application is an extended version of the [Activiti Modeling application  (AMA)](https://github.com/Activiti/activiti-modeling-app), built using
[Alfresco Application Development Framework (ADF)](https://github.com/Alfresco/alfresco-ng2-components) components.

## Installing dependencies

Run the following command to install all third-party dependencies:

```bash
npm install
```

## Setting up environment variables

We need to set some environment variable to be able to run the local dev server. In the project root folder, create an `.env` file (this is gitignored) with the following data:

```bash
APP_CONFIG_BPM_HOST="<your-api-url>"
APP_CONFIG_ECM_HOST="<your-api-url>"

# Like: http://my-acm.implementation.com/auth/realms/alfresco
APP_CONFIG_OAUTH2_HOST="<your-api-url/auth>"
# Like: http://my-acm.implementation.com/auth/admin/realms/alfresco
APP_CONFIG_IDENTITY_HOST="<your-api-url/auth/admin>"

APP_CONFIG_AUTH_TYPE="OAUTH"
APP_CONFIG_OAUTH2_CLIENTID="activiti"
APP_CONFIG_OAUTH2_IMPLICIT_FLOW=true
APP_CONFIG_OAUTH2_SILENT_LOGIN=true
APP_CONFIG_OAUTH2_REDIRECT_SILENT_IFRAME_URI="{protocol}//{hostname}{:port}/assets/silent-refresh.html"
APP_CONFIG_OAUTH2_REDIRECT_LOGIN=/
APP_CONFIG_OAUTH2_REDIRECT_LOGOUT=/
APP_CONFIG_NOTIFICATION_LAST=6000
APP_CONFIG_SHOW_NOTIFICATION_HISTORY=true
```

### Running the application

Use one of the following commands to run the application:

```bash
# develop server
npm start

# Production server
npm start -- --prod
```

### Building the application

Use one of the following commands to build the application:

```bash
# develop build
npm run build

# Production build
npm run build -- --prod
```

### Running unit tests

```bash
npm test
```

## Running in Docker

First build the application as above.

Then `docker build . -t alfresco/alfresco-apps:latest` to build the image

Start with below (substituting with values for your deployment):

`docker run -it -e APP_CONFIG_OAUTH2_HOST="http://KEYCLOAKHOST/auth/realms/activiti" -e APP_CONFIG_OAUTH2_CLIENTID="activiti" -e APP_CONFIG_BPM_HOST="http://GATEWAYHOST" -p 8080:80 alfresco/alfresco-modeling-app:latest`

If any substitutions don't work then check that the placeholders in `docker-entrypoint.sh` match `src/app.config.json`

## Browser Support

The application is supported in the following browsers:

| **Browser**   | **Version** |
| ------------- | ----------- |
| Chrome        | Latest      |
| Safari (OS X) | 9.x         |
| Firefox       | Latest      |
| Edge          | 13, 14      |
