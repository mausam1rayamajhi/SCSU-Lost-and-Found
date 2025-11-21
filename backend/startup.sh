#!/bin/bash

cd /home/site/wwwroot/backend
gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app
