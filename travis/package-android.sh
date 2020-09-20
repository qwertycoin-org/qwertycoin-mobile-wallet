#!/bin/bash -v

set -e

if [[ "$TRAVIS_BRANCH" == "testnet" ]]
then
    mkdir -p output
    cp platforms/android/app/build/outputs/apk/debug/app-debug.apk output/qwertycoin-mobile-wallet-debug.apk
    exit
fi

mkdir -p output
cp platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk output/qwertycoin-mobile-wallet-release-unsigned.apk
