#!/bin/env sh
export PYTHONPATH=`pwd`
source  ~/.venvs/chaostk/Scripts/activate
chaos --verbose run springtest.json --fail-fast
