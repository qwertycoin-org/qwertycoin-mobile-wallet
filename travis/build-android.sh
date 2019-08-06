#!/bin/bash -v

set -e

cordova platform add android --nofetch

if [[ "$TRAVIS_BRANCH" == "develop" ]]
then
    cordova build android
else
    cordova build android --release
fi
