# Activiti Modeling Application

| master | [![Build Status](https://travis-ci.org/Activiti/activiti-modeling-app.svg?branch=master)](https://travis-ci.org/Activiti/activiti-modeling-app) |
| - | - |

## Project Discontinuation Announcement

> ---
> **Warning**
>
> Dear valued contributors and users of the Activiti Modeling Application,
>
> We regret to inform you that after much consideration, we have decided to discontinue the project. This was not an easy decision, but it has become necessary due to a variety of factors such as changes in our priorities, limited resources, and technical challenges.
>
> We would like to express our sincerest gratitude to everyone who has been involved with the project and contributed to its growth. Your hard work and dedication will always be remembered and appreciated.
> 
> The project will not be maintained or evolved in the future, but we will provide resources and support for anyone who wants to continue the development of the project, or fork it for their own use.
> 
> We understand that this news may be disappointing, but we hope that everyone involved can look back on the project with pride and satisfaction for the accomplishments that were achieved.
> 
> Thank you for your understanding and support.
> 
> ---

<p align="center">
    <img title="Activiti" width="250px" src="./app/src/assets/activiti.png" alt="Activiti">
</p>

## Introduction

The Alfresco Modeling Application is an extended version of the [Activiti Modeling application  (AMA)](https://github.com/Activiti/activiti-modeling-app), built using
[Alfresco Application Development Framework (ADF)](https://github.com/Alfresco/alfresco-ng2-components) components.

## Installing dependencies

Run the following command to install all third-party dependencies:

```bash
npm ci
```

## App required environment variables

We need to set some environment variables to be able to run the local dev server. In the project root folder, create a `.env` file (this is gitignored) with the following data:

```bash
# App config settings
APP_CONFIG_BPM_HOST="<url>"
APP_CONFIG_ECM_HOST="<url>"
APP_CONFIG_OAUTH2_HOST="<url>"
APP_CONFIG_IDENTITY_HOST="<url>"
APP_CONFIG_PROVIDER="ALL"
APP_CONFIG_AUTH_TYPE="OAUTH"
APP_CONFIG_OAUTH2_CLIENTID="alfresco"
APP_CONFIG_OAUTH2_IMPLICIT_FLOW=true
APP_CONFIG_OAUTH2_SILENT_LOGIN=true
APP_CONFIG_OAUTH2_REDIRECT_SILENT_IFRAME_URI="{protocol}//{hostname}{:port}/assets/silent-refresh.html"
APP_CONFIG_OAUTH2_REDIRECT_LOGIN=/
APP_CONFIG_OAUTH2_REDIRECT_LOGOUT=/
APP_CONFIG_APPS_DEPLOYED="[{"name": "simpleapp"}]"

# MODELING RELATED
APP_CONFIG_NOTIFICATION_LAST=6000
APP_CONFIG_SHOW_NOTIFICATION_HISTORY=true

# E2E settings
E2E_USE_MOCK_BACKEND=true
E2E_HOST="http://localhost"
E2E_PORT="4200"
BROWSER_RUN="true"
E2E_PREFIX="e2e"
SMART_RUNNER_DIRECTORY=".protractor-smartrunner"
SAVE_SCREENSHOT="true"
SCREENSHOT_URL="<url>"
SCREENSHOT_PASSWORD="<password>"
LOG_LEVEL="TRACE"
LOG=true

# Test user credentials
E2E_USERNAME="<username>"
E2E_PASSWORD="<password>"
E2E_UNAUTHORIZED_USER="<username>"
E2E_UNAUTHORIZED_USER_PASSWORD="<password>"
IDENTITY_USER_EMAIL="<username>"
IDENTITY_USER_PASSWORD="<password>"
SUPERADMIN_EMAIL="<username>"
SUPERADMIN_PASSWORD="<password>"
DEVOPS_EMAIL="<username>"
DEVOPS_PASSWORD="<password>"
MODELER_EMAIL="<username>"
MODELER_PASSWORD="<password>"
PROCESS_ADMIN_EMAIL="<username>"
PROCESS_ADMIN_PASSWORD="<password>"
HR_USER="<username>"
HR_USER_PASSWORD="<password>"
ADMIN_EMAIL="<email>"
ADMIN_PASSWORD="<password>"
```
### Running the application

Use one of the following commands to run the application:

```bash
# develop server
npm start modeling-ce

# Production server
npm start modeling-ce -- --prod
```

### Building the application

Use one of the following commands to build the application:

```bash
# develop build
npm run build modeling-ce

# Production build
npm run build modeling-ce -- --prod
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
| Safari (OS X) | Latest      |
| Firefox       | Latest      |
| Microsoft Edge | Latest     |
