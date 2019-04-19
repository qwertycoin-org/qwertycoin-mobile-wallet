# Qwertycoin Mobile Wallet
ExploShot's repository for the Android & Ios mobile wallet

The project is based on the [official Qwertycoin webwallet](https://github.com/qwertycoin-org/webwallet-js).

The projects are sharing the same [Translation Repository](https://github.com/qwertycoin-org/translation-mobileweb), which can be easy edit with the new [Qwertycoin Translation Editor](https://github.com/qwertycoin-org/JsonTranslationEditor/releases/download/v1.0.1/Qwertycoin-Translation-Editor_v1.0.1.7.zip).

If you find some bugs feel free to create an Issue.

# Technologies
The project is build using Apache Cordova and wraps the webwallet and adds native functionalities for a better user experience.  
Most of the code is then handled by this other project.

# How to build

## Compile
To build the app, you need NodeJs and Apache Cordova. [See the instructions](https://cordova.apache.org/docs/en/latest/guide/cli/) on the official website.
Android & Ios dependencies are not part of this scope.

## Steps

I appreciate

```
tsc --project tsconfig.prod.json && node build.js
```

Create a directory named "www", empty.

The next step is to compile with 
```
cordova build
```

To launch the Android app you will need to launch
```
cordova run android
```