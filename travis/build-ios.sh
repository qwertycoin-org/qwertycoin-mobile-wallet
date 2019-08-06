#!/bin/bash -v

set -e

cordova platform add ios --nofetch

if [[ "$TRAVIS_BRANCH" == "develop" ]]
then
    cordova build ios
else
    cordova build ios --release
fi
