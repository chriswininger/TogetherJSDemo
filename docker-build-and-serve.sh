#!/usr/bin/env bash

set -e

./docker-build.sh
./docker-serve.sh

set +e