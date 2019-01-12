FROM nginx:stable-alpine

COPY nginx.conf /etc/nginx/nginx.conf
COPY docker-entrypoint.sh /

WORKDIR /usr/share/nginx/html
COPY dist/app .

ENTRYPOINT [ "/docker-entrypoint.sh" ]
