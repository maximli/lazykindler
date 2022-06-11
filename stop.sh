#!/usr/bin/env bash

set -e

kill -9 $(lsof -t -i:9527) &> /dev/null;
kill -9 $(lsof -t -i:8000) &> /dev/null;