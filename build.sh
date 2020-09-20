#!/bin/bash -v

tsc --project tsconfig.prod.json && node build.js
cp -R src/. www
cp -R config/. www
cordova build android
