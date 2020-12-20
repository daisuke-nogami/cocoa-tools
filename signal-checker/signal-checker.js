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


var LEscanobject;

function check_scan_running() {
  let log_div = document.getElementById('test_console');
  log_div.insertAdjacentText('beforeend',' navigator.bluetooth.activeScans' +  navigator.bluetooth.activeScans + '\n');
  log_div.insertAdjacentText('beforeend',' LEscanobject.active' + LEscanobject.active + '\n');
  // これをちゃんと見続けて、スキャンが切れたらトップに戻すような処理を足すべき
}

async function run_test_script() {
  // クリップボードにURLを貼り付けるテスト
  var elem = document.getElementById("privileged_url");
  elem.select();
  document.execCommand("Copy");

  // 各種環境変数の取得練習
  let log_div = document.getElementById('test_console');
  log_div.insertAdjacentText('beforeend',navigator.userAgent+'\n');
  log_div.insertAdjacentText('beforeend', "'bluetooth' in navigator -> "+('bluetooth' in navigator)+'\n');
  log_div.insertAdjacentText('beforeend', "'requestLEScan' in navigator.bluetooth -> "+('requestLEScan' in navigator.bluetooth)+'\n');
  log_div.insertAdjacentText('beforeend', "'requestDevice' in navigator.bluetooth -> "+('requestDevice' in navigator.bluetooth)+'\n');
  log_div.insertAdjacentText('beforeend', '\n');
  //navigator.bluetooth.requestDevice({filters: [{ services: [0xFD6F]}]});

  // 事前の動作環境確認のコードを書いてみる
  // Androidかどうかを確認
  if (navigator.userAgent.indexOf("Chrome") !== -1 && navigator.userAgent.indexOf("Edge") == -1){
    log_div.insertAdjacentText('beforeend', "Using Google Chrome: OK"+'\n');
  } else {
    log_div.insertAdjacentText('beforeend', "Using other browser: NG"+'\n');
  }
  if (navigator.userAgent.indexOf("Android") !== -1 || navigator.userAgent.indexOf("Windows") !== -1){
    log_div.insertAdjacentText('beforeend', "Using Android or Windows: OK"+'\n');
  } else {
    log_div.insertAdjacentText('beforeend', "Using other OS: NG"+'\n');
  }

  // Bluetooth関連APIの利用可否確認 … BluetoothのOn/Offは取れなかった…
  navigator.bluetooth.getAvailability().then(available => {
    if (available)
        log_div.insertAdjacentText('beforeend', "This device supports Bluetooth!"+'\n');
    else
        log_div.insertAdjacentText('beforeend', "Doh! Bluetooth is not supported"+'\n');
  });

  // FlagsでScanningが有効になっているか確認
  if ('requestLEScan' in navigator.bluetooth) {
    log_div.insertAdjacentText('beforeend', "This browser supports Bluetooth LE Scanning!"+'\n');
  } else {
    log_div.insertAdjacentText('beforeend', "Bluetooth LE Scanning is not supported. change FLAG on chrome://flags page."+'\n');

  }

  // permission APIを利用した取得 ⇒ 機能しなさげ
  /*
  navigator.permissions.query({name:'geolocation'}).then(function(permissionStatus) {
    log_div.insertAdjacentText('beforeend', '位置情報のパーミッションの状態は ' + permissionStatus.state + ' です。'+'\n');
    permissionStatus.onchange = function() {
      log_div.insertAdjacentText('beforeend', '位置情報のパーミッションの状態が ' + this.state + ' に変更されました。'+'\n');
    };
  });
  */

  // BLE scanningが走るかの確認
  // タイムアウトのエラー型を作る
  function TimeoutException(message) {
    this.message = message;
    this.name = 'requestLEScan_timeout';
  }
  TimeoutException.prototype.toString = function() {
    return `${this.name}: "${this.message}"`;
  }
  const timeout_promise = new Promise((resolve, reject) => {
      setTimeout(function(){reject(new TimeoutException('waited 10 seconds'))}, 10000);
  });
  try{
    LEscanobject = await Promise.race([
        navigator.bluetooth.requestLEScan({filters: [{ services: [0xFD6F]}]}),
        timeout_promise
    ]);
    setInterval(check_scan_running,1000);
    log_div.insertAdjacentText('beforeend','スキャンできました'+'\n');
  } catch (error) {
    log_div.insertAdjacentText('beforeend','error.name ' + error.name　+'\n');
    log_div.insertAdjacentText('beforeend','error.message ' + error.message　+'\n');
    if (error.name == 'InvalidStateError') {
      log_div.insertAdjacentText('beforeend','スキャンがキャンセルされました'+'\n');
    } else if (error.name == 'NotAllowedError') {
      log_div.insertAdjacentText('beforeend','Bluetoothのスキャンが禁止されています、解除してください'+'\n');
    } else if (error.name == 'NotFoundError') {
      log_div.insertAdjacentText('beforeend','BluetoothがOffになっているか、Chromeの位置情報利用が許可されていません'+'\n');
    } else if (error.name == 'requestLEScan_timeout') {
      log_div.insertAdjacentText('beforeend','プロンプトに10秒間答えずタイムアウトしました'+'\n');
    }
  }
}
