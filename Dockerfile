FROM digitallyseamless/nodejs-bower-grunt:0.10

ENV DEBIAN_FRONTEND noninteractive
ENV NODE_ENV production

RUN apt-get update -y && apt-get install -y daemontools

COPY ./docker/service/pmsiplan /service/pmsiplan
COPY ./client /app/client
COPY ./server /app/server

RUN cd /app/server/ && cp config/config.js.dist config/config.js && npm install

WORKDIR /app/client

RUN NODE_ENV=development npm install && \
    bower install --allow-root && \
    grunt && \
    rm -rf node_modules && \
    rm -rf bower_components \
    npm cache clean && \
    (rm -rf /tmp/* || true)

EXPOSE 3700

VOLUME /app
VOLUME /service

CMD ["svscan", "/service"]
