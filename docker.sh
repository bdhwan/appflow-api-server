#!/bin/bash
rm -rf node_modules
rm -rf admin/node_modules
docker build --no-cache --tag bdhwan/appflow-api-server:1.0 .
docker push bdhwan/appflow-api-server:1.0