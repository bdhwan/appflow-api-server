#!/bin/bash
rm -rf node_modules
rm -rf admin/node_modules
rm -rf config/config.js
docker build --no-cache --tag bdhwan/appflow-api-server:2.3 .
docker push bdhwan/appflow-api-server:2.3