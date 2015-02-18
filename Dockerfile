FROM dockerfile/nodejs-bower-grunt

ENV DEBIAN_FRONTEND noninteractive
ENV NODE_ENV production

RUN apt-get update -y && apt-get install -y daemontools

COPY ./docker/service/pmsiplan /service/pmsiplan
COPY ./client /app/client
COPY ./server /app/server
COPY ./server/config/config.js.dist /app/server/config/config.js

WORKDIR /app/server
RUN npm install

WORKDIR /app/client
RUN NODE_ENV=development npm install && \
    bower install --allow-root && \
    grunt && \
    rm -rf node_modules && \
    rm -rf bower_components

RUN npm cache clean && \
    (rm -rf /tmp/* || true)

EXPOSE 3700

VOLUME /app
VOLUME /service

CMD ["svscan", "/service"]
