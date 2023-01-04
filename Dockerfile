FROM nginxinc/nginx-unprivileged:1.19.3-alpine

ARG PROJECT_NAME

COPY docker/default.conf.template /etc/nginx/templates/

COPY dist/$PROJECT_NAME /usr/share/nginx/html/
COPY dist/$PROJECT_NAME/app.config.json /etc/nginx/templates/app.config.json.template

USER root
RUN chmod a+w -R /etc/nginx/conf.d
USER 101

# Nginx default settings
# -------------------------------
ENV SERVER_PORT=8080
ENV BASE_PATH=/
ENV NGINX_ENVSUBST_OUTPUT_DIR=/etc/nginx/conf.d

ENV APP_CONFIG_AUTH_TYPE="OAUTH"

# App config variables with default values:
# -------------------------------
ENV APP_CONFIG_IDENTITY_HOST="{protocol}//{hostname}{:port}/auth/admin/realms/alfresco"
ENV APP_CONFIG_OAUTH2_HOST="{protocol}//{hostname}{:port}/auth/realms/alfresco"
ENV APP_CONFIG_BPM_HOST="{protocol}//{hostname}{:port}"
ENV APP_CONFIG_ECM_HOST="{protocol}//{hostname}{:port}"


ENV APP_CONFIG_OAUTH2_CLIENTID="activiti"
ENV APP_CONFIG_OAUTH2_IMPLICIT_FLOW=true
ENV APP_CONFIG_OAUTH2_SILENT_LOGIN=true
ENV APP_CONFIG_OAUTH2_REDIRECT_SILENT_IFRAME_URI="{protocol}//{hostname}{:port}/assets/silent-refresh.html"
ENV APP_CONFIG_OAUTH2_REDIRECT_LOGIN="/"
ENV APP_CONFIG_OAUTH2_REDIRECT_LOGOUT="/"

ENV APP_CONFIG_NOTIFICATION_LAST=4000
ENV APP_CONFIG_SHOW_NOTIFICATION_HISTORY=true
