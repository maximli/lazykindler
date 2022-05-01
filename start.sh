#!/usr/bin/env bash

bash ./stop.sh

cd backend && python3 app.py &
cd frontend && yarn start &
