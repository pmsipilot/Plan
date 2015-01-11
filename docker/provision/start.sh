#!/bin/bash -x

if [ "$PMSIPLAN_ENV" = "prod" ]; then
    git clone https://github.com/pmsipilot/pmsiplan.git /app || { cd /app; git pull; }
    cd /app && git reset --hard $PMSIPLAN_VERSION
    cp -f /app/server/config/config.js.dist /app/server/config/config.js
fi

cd /app/server && npm install
cd /app/client && (npm install; bower install --allow-root; grunt)

svscan /service
