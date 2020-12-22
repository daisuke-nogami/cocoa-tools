// グローバル変数
// スキャン状況把握のための変数
var LEscanobject;

// TOPに戻るボタン
function return_top(target_type) {
  // 画面切り替え用の配列
  var windows_handle = [
    document.getElementById("1_setting_a"),     // 0
    document.getElementById("1_setting_b_end"), // 1
    document.getElementById("1_setting_b"),     // 2
    document.getElementById("2_top"),           // 3
    document.getElementById("3_loading"),       // 4
    document.getElementById("4_touch"),         // 5
    document.getElementById("5_done_a"),        // 6
    document.getElementById("5_done_b"),        // 7
    document.getElementById("6_setting_FQA"),    // 8
    document.getElementById("7_FQA")            // 9
  ];
  // いったん全部隠す
  for (var i=0; i<windows_handle.length; i++) {
    windows_handle[i].style.visibility = 'hidden';
  }
  // typeに応じて戻る画面を選ぶ
  if (target_type == "operator") {
    windows_handle[0].style.visibility = 'visible';
  } else if (target_type == "enduser") {
    windows_handle[3].style.visibility = 'visible';
  } else if (target_type == "faq_operator") {
    windows_handle[8].style.visibility = 'visible';
  } else if (target_type == "faq_enduser") {
    windows_handle[9].style.visibility = 'visible';
  } else {
    windows_handle[target_type].style.visibility = 'visible';
  }
}

// UI確認用の画面切り替え関数（デバッグ用）
var windows_visible = 0;
function toggle_visible() {
  if (windows_visible < 9) {
    windows_visible++;
  } else {
    windows_visible = 0;
  }
  return_top(windows_visible);
}

// スキャン全般関連
// スキャン中にフォーカスが外れるなどしてスキャンが止まったのを検知する関数
var advertising_scanning = false;
var scan_running_checker;
function check_scan_running() {
  // スキャン中に
  if (advertising_scanning) {
    // スキャンが止まっていたら
    if ( !(LEscanobject.active) ) {
      // 問答無用で起動画面に戻す
      for (var i=1; i<windows_handle.length; i++) {
        windows_handle[i].style.visibility = 'hidden';
      }
      windows_handle[0].style.visibility = 'visible';
      advertising_scanning = false;
      clearInterval(scan_running_checker);
    }
  }
}


// 動作チェック関連
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
  if (navigator.userAgent.indexOf("Android") == -1){
    window_fail.style.visibility = 'visible';
    return;
  }

  // Androidのバージョンを確認
  if ( parseFloat(navigator.userAgent.slice(navigator.userAgent.indexOf("Android")+8)) < 6 ) {
    window_retry.style.visibility = 'visible';
    document.getElementById("reason_1_header").style.display = 'flex';
    return;
  }

  // Chromeで起動しているかどうかを確認
  if (navigator.userAgent.indexOf("Chrome") == -1 || navigator.userAgent.indexOf("Edge") !== -1){
    window_retry.style.visibility = 'visible';
    document.getElementById("reason_2_header").style.display = 'flex';
    return;
  } else {
    // Chromeのバージョンを確認　(85以降)
    if (parseFloat(navigator.userAgent.slice(navigator.userAgent.indexOf("Chrome")+7)) < 84) {
      window_retry.style.visibility = 'visible';
      document.getElementById("reason_2_header").style.display = 'flex';
      return;
    }
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
    LEscanobject = await navigator.bluetooth.requestLEScan({filters: [{ services: [0xFD6F]}]});
    window_success.style.visibility = 'visible';
    advertising_scanning = false;
    scan_running_checker = setInterval(check_scan_running,1000);
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
