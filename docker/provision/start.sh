#!/bin/bash -ex

cd /var/www/pmsiplan/server && npm install
cd /var/www/pmsiplan/client && (npm install; bower install --allow-root; grunt)
cp -f /var/www/pmsiplan/server/config/config.js.dist /var/www/pmsiplan/server/config/config.js
/etc/init.d/pmsiplan start
