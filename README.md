# Activiti Modeling Application

| master | [![Build Status](https://travis-ci.org/Activiti/activiti-modeling-app.svg?branch=master)](https://travis-ci.org/Activiti/activiti-modeling-app) |
| - | - |

<p align="center">
    <img title="Activiti" width="250px" src="activiti.png" alt="Activiti">
</p>

## Introduction

The Alfresco Modeling Application is an extended version of the [Activiti Modeling application  (AMA)](https://github.com/Activiti/activiti-modeling-app), built using
[Alfresco Application Development Framework (ADF)](https://github.com/Alfresco/alfresco-ng2-components) components.

## Installing dependencies

Run the following command to install all third-party dependencies:

```bash
npm install
```

### Running the application

Use one of the following commands to run the application:

```bash
# Development server
npm start

# Production server
npm start -- --prod
```

### Building the application

Use one of the following commands to build the application:

```bash
# Development build
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

Then `docker build . -t alfresco/alfresco-modeler-app:latest` to build the image

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
