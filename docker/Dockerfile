FROM dockerfile/nodejs-bower-grunt

ENV DEBIAN_FRONTEND noninteractive

VOLUME /app/client
VOLUME /app/server
VOLUME /service

ADD service/pmsiplan/ /service/pmsiplan
ADD provision/start.sh /start.sh
RUN chmod 0755 /start.sh

EXPOSE 3700

RUN apt-get update -y && apt-get install -y git daemontools

ENTRYPOINT ["/start.sh"]
