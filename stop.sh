#!/usr/bin/env bash

set -e

kill -9 $(lsof -t -i:9527) || true
kill -9 $(lsof -t -i:8000) || true