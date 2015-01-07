FROM       dockerfile/nodejs-bower-grunt

RUN DEBIAN_FRONTEND=noninteractive apt-get update && apt-get install -y supervisor

ADD provision/initd /etc/init.d/pmsiplan
RUN chmod 0755 /etc/init.d/pmsiplan

ADD provision/start.sh /start.sh
RUN chmod 0755 /start.sh

RUN npm install forever -g

COPY provision/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
