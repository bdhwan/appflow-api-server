#!/bin/bash
pwd

echo 'BUILD_SERVER_URL' $BUILD_SERVER_URL
echo 'DB_NAME' $DB_NAME

echo 'DB_HOST' $DB_HOST
echo 'DB_USER' $DB_USER
echo 'DB_PASSWORD' $DB_PASSWORD
echo 'DB_PORT' $DB_PORT

pwd
node config/fix_conf.js $BUILD_SERVER_URL $DB_NAME $DB_HOST $DB_USER $DB_PASSWORD $DB_PORT
pm2-docker process.yml
