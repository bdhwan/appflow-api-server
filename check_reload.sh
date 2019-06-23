#!/bin/bash
echo "ok"
cd /home/appflow/admin
git reset --hard HEAD~1
git pull
echo "done"