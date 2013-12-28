#!/bin/bash

if [ ! -d "./env/" ]
then
    virtualenv env
fi

source ./env/bin/activate

pip freeze > /tmp/apollo_temp_deps
if ! cmp ./requirements.txt /tmp/apollo_temp_deps > /dev/null 2>&1
then
  echo "Installing Python dependencies ..."
  pip install -r ./requirements.txt
fi

./env/bin/python ./src/main.py