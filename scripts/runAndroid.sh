#!/bin/bash -v

tsc --project tsconfig.prod.json && node build.js
./scripts/incrementBuildNumbers.js
cp -R src/. www
cordova build android
cordova run android --emulator