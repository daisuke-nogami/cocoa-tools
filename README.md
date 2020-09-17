# cocoa-tools
Utility tools for COCOA ( Covid-19 Exposure Notification System in Japan ) using Web-Bluetooth

## contents

- [Install Checker](https://daisuke-nogami.github.io/cocoa-tools/install-checker.html)
- [Counter](https://daisuke-nogami.github.io/cocoa-tools/counter.html)

## about

COCOA(Covid-19接触確認アプリ)の普及状況把握などに用いるためのツールをWeb-Bluetoothで作成したものです。
Web-Bluetoothが使えるブラウザで動作することを期待しています。

## enviroment

動作確認をした環境は以下の通りです。

| OS | 端末 | 動作状況 | 利用条件 |
| ---- | ------ | ----- | ------ |
| Android 10 | Galaxy S9 | 問題なく動作 | Chrome開発中機能フラグをONにする |
| Android 8 | HUAWEI P10lite | 問題なく動作 | Chrome開発中機能フラグをONにする |
| Windows 10 | VAIO S13 | 問題があるが動作 | Chrome開発中機能フラグをONにする + Chrome DevToolsで navigator.bluetooth.requestLEScan を実行し、ダイアログを出現させる |

- 注: Chrome開発中機能フラグをONにする =  chrome://flags/#enable-experimental-web-platform-features をEnabledにする 
- Windows 10での動作不具合は、ページ内スクリプトで navigator.bluetooth.requestLEScan を読んだ時に許可ダイアログが表示されないというChromeのバグによるもの。Chrome DevToolsで実行するとダイアログがでて許可できるので許可をすると、その後ページ内スクリプトでの動作もされるようになる。
