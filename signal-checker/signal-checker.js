// UI構築時に使う仮の画面切り替え関数
var windows_visible = 0;
function toggle_visible() {
  var windows_handle = [
    document.getElementById("1_setting_a"),
    document.getElementById("1_setting_b_end"),
    document.getElementById("1_setting_b"),
    document.getElementById("2_top"),
    document.getElementById("3_loading"),
    document.getElementById("4_touch"),
    document.getElementById("5_done_a"),
    document.getElementById("5_done_b"),
    document.getElementById("6_setting_FQA")
  ];
  windows_handle[windows_visible].style.visibility = 'hidden';
  if (windows_visible < windows_handle.length - 1) {
    windows_visible++;
  } else {
    windows_visible = 0;
  }
  windows_handle[windows_visible].style.visibility = 'visible';
}

// アコーディオン表示の開閉
function toggle_accordion(target) {
  var target_accordion = document.getElementById(target+'_header');
  var target_content = document.getElementById(target+'_content');

  if( target_content.style.display == 'none') {
    target_content.style.display = 'block';
    target_accordion.style.borderBottomRightRadius = '0px';
    target_accordion.style.borderBottomLeftRadius = '0px';
  } else {
    target_content.style.display = 'none';
    target_accordion.style.borderBottomRightRadius = '10px';
    target_accordion.style.borderBottomLeftRadius = '10px';
  }
}

// 以下本番用コード
var LEscanobject;

// クリップボードに特権URLを格納した上でウインドウを開く
function open_new_tab_with_privileged_url() {
  // クリップボードにURLを貼り付けるテスト
  var elem = document.getElementById("privileged_url");
  elem.select();
  document.execCommand("Copy");
  window.open();
}

// 動作環境テスト
async function check_enviroment(){
  // 表示するwindowのハンドル
  var window_origin  = document.getElementById("1_setting_a");
  var window_fail    = document.getElementById("1_setting_b_end");
  var window_retry   = document.getElementById("1_setting_b");
  var window_success = document.getElementById("2_top");

  // 元のWindowを隠す
  window_origin.style.visibility = 'hidden';

  // Androidかどうかを確認
/*
  if (navigator.userAgent.indexOf("Android") == -1){
    window_fail.style.visibility = 'visible';
    return;
  }
*/
  // Androidのバージョンを確認
/*
  document.getElementById("reason_2_header").style.display = 'flex';
 */

  // Chromeで起動しているかどうかを確認
  if (navigator.userAgent.indexOf("Chrome") == -1 || navigator.userAgent.indexOf("Edge") !== -1){
    window_retry.style.visibility = 'visible';
    document.getElementById("reason_2_header").style.display = 'flex';
    return;
  } else {
    // Chromeのバージョンを確認

  }

  // #enable-experimental-web-platform-featuresの確認
  // 念のため、Bluetooth関連APIの利用可否を確認してからフラグを確認
  navigator.bluetooth.getAvailability().then(available => {
    if (available) {
      // FlagsでScanningが有効になっているか確認
      if ('requestLEScan' in navigator.bluetooth === false) {
        window_retry.style.visibility = 'visible';
        document.getElementById("reason_3_header").style.display = 'flex';
        return;
      }
    } else {
      // もしBluetoothが使えなければ、Chromeをアップデートさせる
      window_retry.style.visibility = 'visible';
      document.getElementById("reason_2_header").style.display = 'flex';
      return;
    }
  });

  // BLE scanningが走るかの確認
  try{
    LEscanobject = navigator.bluetooth.requestLEScan({filters: [{ services: [0xFD6F]}]});
    window_success.style.visibility = 'visible';
  } catch (error) {
    if (error.name == 'InvalidStateError') {
      // スキャンがキャンセルされた
      window_retry.style.visibility = 'visible';
      document.getElementById("reason_6_header").style.display = 'flex';
      return;
    } else if (error.name == 'NotAllowedError') {
      // スキャンが禁止されている
      window_retry.style.visibility = 'visible';
      document.getElementById("reason_4_header").style.display = 'flex';
      return;
    } else if (error.name == 'NotFoundError') {
      // BluetoothがOffになっているか、Chromeの位置情報利用が許可されていない
      window_retry.style.visibility = 'visible';
      document.getElementById("reason_5_header").style.display = 'flex';
      return;
    }
  }
}










function check_scan_running() {
  let log_div = document.getElementById('test_console');
  log_div.insertAdjacentText('beforeend',' navigator.bluetooth.activeScans' +  navigator.bluetooth.activeScans + '\n');
  log_div.insertAdjacentText('beforeend',' LEscanobject.active' + LEscanobject.active + '\n');
  // これをちゃんと見続けて、スキャンが切れたらトップに戻すような処理を足すべき
}
