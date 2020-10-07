# cocoa-tools
Utility tools for COCOA ( Covid-19 Exposure Notification System in Japan ) using Web-Bluetooth / COCOA(Covid-19接触確認アプリ)の普及状況把握などに用いるためのツール群

## tools list

- [Install Checker - 端末のCOCOAインストール状況チェック](https://daisuke-nogami.github.io/cocoa-tools/install-checker.html)
  - 端末にアプリを表示させることなく、COCOAのインストール状況をBluetooth Advertisingから確認するページ
- [Counter - COCOAインストール済み端末カウント](https://daisuke-nogami.github.io/cocoa-tools/counter.html)
  - 周囲のCOCOAインストール済みの端末数を計測するページ

## about

COCOA(Covid-19接触確認アプリ)の普及状況把握などに用いるためのツールをWeb-Bluetoothで作成したものです。
個人情報収集をしうるツールのため、HTML/Javascriptを用いて作成することで、処理内容を限りなくオープンにし、収集の懸念を無くすことを目的としています。

Web-Bluetoothが使えるブラウザで動作することを期待しています。

## enviroment

動作確認をした環境は以下の通りです。

### Smartphones

- 条件1a: OS上でChromeの位置情報利用を許可する, Chromeのフラグで chrome://flags/#enable-experimental-web-platform-features をEnabledにする

| 端末 | OS, Chrome version | 動作状況 | 条件 |
| ---- | ------ | ----- | ------ |
| Samsung Galaxy S9 | Android 10, Chrome 85.0.4183.101 | 動作 | 条件1a |
| HUAWEI P10lite | Android 8, Chrome 85.0.4183.101 | 動作 | 条件1a |
| Samsung Galaxy S20 5G | Android 10, Chrome 85.0.4183.127 | 動作 | 条件1a |

### Desktop PC

| 機種 | OS, Chrome version | 動作状況 | 条件 |
| ---- | ------ | ----- | ------ |
| VAIO S13 | Windows 10 Pro (1903), Chrome 85.0.4183.102 | 動作 | 条件1b,条件2 |
| lenovo ThinkCentre M715q | Windows 10 Home (2004), Chrome 85.0.4183.102 | 動作 | 条件1b,条件2 |

- 条件1b: Chromeのフラグで chrome://flags/#enable-experimental-web-platform-features をEnabledにする
- 条件2: Chrome DevToolsのconsoleで `navigator.bluetooth.requestLEScan({filters: [{ services: [0xFD6F]}]})` を実行し、スキャンを許可するダイアログを出して、許可をしてから実行
  - ページ内スクリプトで navigator.bluetooth.requestLEScan を呼ぶと許可ダイアログが表示されない(一瞬出るがすぐにキャンセルされる)ため。この動作がChromeのバグなのか仕様なのかは不明。
