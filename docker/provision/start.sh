#!/bin/bash -x

if [ "$PMSIPLAN_ENV" = "prod" ]; then
    git clone https://github.com/pmsipilot/pmsiplan.git /var/www/pmsiplan || { cd /var/www/pmsiplan; git pull; }
    cd /var/www/pmsiplan && git reset --hard $PMSIPLAN_VERSION
fi

cd /var/www/pmsiplan/server && npm install
cd /var/www/pmsiplan/client && (npm install; bower install --allow-root; grunt)
cp -f /var/www/pmsiplan/server/config/config.js.dist /var/www/pmsiplan/server/config/config.js
/etc/init.d/pmsiplan start
