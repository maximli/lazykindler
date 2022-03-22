#!/usr/bin/env bash

bash ./stop.sh

/opt/homebrew/opt/mysql/bin/mysqld_safe --datadir=/opt/homebrew/var/mysql &
sleep 3
cd backend && python3 app.py &
cd frontend && yarn start &
