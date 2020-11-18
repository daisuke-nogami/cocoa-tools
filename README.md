# cocoa-tools
Utility tools for COCOA ( Covid-19 Exposure Notification System in Japan ) using Web-Bluetooth / COCOA(Covid-19接触確認アプリ)の普及状況把握などに用いるためのツール群

## tools list

### 一般に提供予定で開発中のコード

- [ENS Signal Confirmer - COCOA動作状況チェッカー](https://daisuke-nogami.github.io/cocoa-tools/signal-confirmer.html)
  - 端末にアプリを表示させることなく、COCOAの動作状況をBluetooth LEの信号を受信することで確認するツール

### 横浜スタジアムでの技術実証に用いたコード

- [Install Checker - 端末のCOCOAインストール状況チェック](https://daisuke-nogami.github.io/cocoa-tools/install-checker.html)
  - 端末にアプリを表示させることなく、COCOAのインストール状況をBluetooth Advertisingから確認するページ
- [Counter - COCOAインストール済み端末カウント](https://daisuke-nogami.github.io/cocoa-tools/counter.html)
  - 周囲のCOCOAインストール済みの端末数を計測するページ

## about

COCOA(Covid-19接触確認アプリ)の普及状況把握などに用いるためのツールをWeb-Bluetoothで作成したものです。

個人情報収集に繋がると懸念されうるツールのため、

- HTML/Javascriptを用いて、コードが直接Webページに反映されるgithub-pagesを用いて公開することで、処理内容を限りなくオープンにする
- 通信内容の取得に制約があるWeb-Bluetooth技術を用いることで、取得可能な情報に制約を掛ける

の2つの観点から、Web-bluetoothを用いることで、個人情報収集の懸念の解消を目指しています。

そのため、利用にはWeb-Bluetoothが使えるブラウザ/端末が必要となります。

## enviroment

動作確認をした環境は以下の通りです。

### Smartphones

- 条件1a: OS上でChromeの位置情報利用を許可する, Chromeのフラグで chrome://flags/#enable-experimental-web-platform-features をEnabledにする

| 端末 | OS, Chrome version | 動作状況 | 条件 |
| ---- | ------ | ----- | ------ |
| Samsung Galaxy S20 5G | Android 10, Chrome 85.0.4183.127- | 動作 | 条件1a |
| HUAWEI P10lite | Android 8, Chrome 85.0.4183.101- | 動作 | 条件1a |
| Samsung Galaxy S9 | Android 10, Chrome 85.0.4183.101- | 動作 | 条件1a |
| Samsung Galaxy S8 | Android 9, Chrome 86.0.4240.110 | 動作 | 条件1a |
| Google Pixel3a | Android 11, Chrome 86.0.4240.110 | 動作 | 条件1a |
| Samsung Galaxy S7 edge | Android 8, Chrome 86.0.4240.110 | 動作 | 条件1a |
| Xperia 10 II      | Android 10, Chrome 86.0.4240.110 | 動作 | 条件1a |
| Google Pixel 5    | Android 11, Chrome 86.0.4240.110 | 動作 | 条件1a |
| Google Pixel4a(5G)| Android 11, Chrome 86.0.4240.110 | 動作 | 条件1a |
| Google Pixel 4 XL | Android 10, Chrome 86.0.4240.110 | 動作 | 条件1a |
| Google Pixel 4    | Android 10, Chrome 86.0.4240.110 | 動作 | 条件1a |
| Google Pixel 3 XL | Android 9.0, Chrome 86.0.4240.110 | 動作 | 条件1a |
| Google Pixel 3    | Android 9.0, Chrome 86.0.4240.110 | 動作 | 条件1a |
| Google Nexus 6p   | Android 8.1, Chrome 86.0.4240.110 | 動作 | 条件1a |
| Google Nexus 5X   | Android 8.0, Chrome 86.0.4240.110 | 動作 | 条件1a |
| Xperia 1          | Android 9.0, Chrome 86.0.4240.110 | 動作 | 条件1a |
| Xperia X Performance | Android 8.0, Chrome 86.0.4240.110 | 動作 | 条件1a |
| Xperia XZ2        | Android 8.0, Chrome 86.0.4240.110 | 動作 | 条件1a |
| Xperia XZ         | Android 8.0, Chrome 86.0.4240.110 | 動作 | 条件1a |
| AQUOS R3          | Android 9.0, Chrome 86.0.4240.110 | 動作 | 条件1a |
| AQUOS sense3 plus | Android 9.0, Chrome 86.0.4240.110 | 動作 | 条件1a |
| Galaxy Feel2      | Android 8.1, Chrome 86.0.4240.110 | 動作 | 条件1a |

※[米ZDNetの報道"Apple declined to implement 16 Web APIs in Safari due to privacy concerns"](https://www.zdnet.com/article/apple-declined-to-implement-16-web-apis-in-safari-due-to-privacy-concerns/)によれば、SafariではWeb-bluetoothでのscanningは拒否されているとのことなので、おそらくiOSでは動作が難しいと思われる

### Desktop PC

| 機種 | OS, Chrome version | 動作状況 | 条件 |
| ---- | ------ | ----- | ------ |
| VAIO S13 | Windows 10 Pro (1903), Chrome 85.0.4183.102 | 動作 | 条件1b,条件2 |
| lenovo ThinkCentre M715q | Windows 10 Home (2004), Chrome 85.0.4183.102 | 動作 | 条件1b,条件2 |

- 条件1b: Chromeのフラグで chrome://flags/#enable-experimental-web-platform-features をEnabledにする
- 条件2: Chrome DevToolsのconsoleで `navigator.bluetooth.requestLEScan({filters: [{ services: [0xFD6F]}]})` を実行し、スキャンを許可するダイアログを出して、許可をしてから実行
  - ページ内スクリプトで navigator.bluetooth.requestLEScan を呼ぶと許可ダイアログが表示されない(一瞬出るがすぐにキャンセルされる)ため。この動作がChromeのバグなのか仕様なのかは不明。
