![image](https://cdn.qwertycoin.org/images/press/other/qwc-github-3.png)
#### Master Build Status
[![Build Status](https://travis-ci.org/qwertycoin-org/qwertycoin-mobile-wallet.svg?branch=master)](https://travis-ci.org/qwertycoin-org/qwertycoin-mobile-wallet)
[![Build status](https://ci.appveyor.com/api/projects/status/udpsj8mf5x7s1rt6/branch/master?svg=true)](https://ci.appveyor.com/project/Qwertycoin/qwertycoin-mobile-wallet/branch/master)

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

## Our app is now available on Google Play:

<a href="https://play.google.com/store/apps/details?id=org.qwertycoin.wallet"><img src="https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png" width="200"></a>

## Donate <a name="donate"></a>

```
QWC: QWC1K6XEhCC1WsZzT9RRVpc1MLXXdHVKt2BUGSrsmkkXAvqh52sVnNc1pYmoF2TEXsAvZnyPaZu8MW3S8EWHNfAh7X2xa63P7Y
```
```
BTC: 1DkocMNiqFkbjhCmG4sg9zYQbi4YuguFWw
```
```
ETH: 0xA660Fb28C06542258bd740973c17F2632dff2517
```
```
BCH: qz975ndvcechzywtz59xpkt2hhdzkzt3vvt8762yk9
```
```
XMR: 47gmN4GMQ17Veur5YEpru7eCQc5A65DaWUThZa9z9bP6jNMYXPKAyjDcAW4RzNYbRChEwnKu1H3qt9FPW9CnpwZgNscKawX
```
```
ETN: etnkJXJFqiH9FCt6Gq2HWHPeY92YFsmvKX7qaysvnV11M796Xmovo2nSu6EUCMnniqRqAhKX9AQp31GbG3M2DiVM3qRDSQ5Vwq
```
