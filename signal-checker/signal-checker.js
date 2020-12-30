// グローバル変数
// スキャン状況把握のための変数
var LEscanobject;
// スキャン状況を記録する変数
var terminal_rssi   = [];     // 端末の検知結果を記録する変数
var terminal_count  = [];     // 端末を検知した回数を記録する変数
var detect_criteria = {};     // 端末の判定条件になるRSSI平均値を格納
// 起動時のパフォーマンス測定時間(秒)
const perfomance_check_seconds = 5;

// TOPに戻るボタン
function return_top(target_type) {
  // 画面切り替え用の配列
  var windows_handle = [
    document.getElementById("1_1"), // 0
    document.getElementById("2_1"), // 1
    document.getElementById("2_2"), // 2
    document.getElementById("3_2"), // 3
    document.getElementById("8_1"), // 4
    document.getElementById("4_1"), // 5
    document.getElementById("5_1"), // 6
    document.getElementById("6_1"), // 7
    document.getElementById("7_1"), // 8
    document.getElementById("7_2"), // 9
    document.getElementById("9_1")  // 10
  ];
  // いったん全部隠す
  for (var i=0; i<windows_handle.length; i++) {
    windows_handle[i].style.visibility = 'hidden';
  }
  // typeに応じて戻る画面を選ぶ
  if (target_type == "operator") {
    // 1_1
    windows_handle[0].style.visibility = 'visible';
  } else if (target_type == "enduser") {
    // 4_1
    windows_handle[5].style.visibility = 'visible';
  } else if (target_type == "faq_operator") {
    // 8_1
    windows_handle[4].style.visibility = 'visible';
  } else if (target_type == "faq_enduser") {
    // 9_1
    windows_handle[10].style.visibility = 'visible';
  } else {
    // デバッグ用の画面番号指定
    windows_handle[target_type].style.visibility = 'visible';
  }
}

// UI確認用の画面切り替え関数（デバッグ用）
var windows_visible = 0;
function toggle_visible() {
  // 画面番号をインクリメントする
  if (windows_visible < 10) {
    windows_visible++;
  } else {
    windows_visible = 0;
  }
  // 画面が 2_2 (2番) なら、Q&Aのアコーディオンを全部開く
  if (windows_visible == 2) {
    document.getElementById("reason_1_header").style.display = 'flex';
    document.getElementById("reason_2_header").style.display = 'flex';
    document.getElementById("reason_3_header").style.display = 'flex';
    document.getElementById("reason_4_header").style.display = 'flex';
    document.getElementById("reason_5_header").style.display = 'flex';
    document.getElementById("reason_6_header").style.display = 'flex';
  }
  return_top(windows_visible);
}

// スキャン全般関連
// スキャン中にフォーカスが外れるなどしてスキャンが止まったのを検知する関数
var scan_running_checker;
var return_top_when_scan_stopped = false; // スキャン停止時にトップに戻すかどうか
function check_scan_running() {
  // 測定結果を記録した変数を定期的に空にする
    // 変数の中身を空にするルーチン
    function func_assoc_array(num) {
      // ログの中身があり
      if ( terminal_rssi[num] ) {
        // 中身が空っぽでなければ、
        if ( Object.keys(terminal_rssi[num]).length > 0) {
          // 空にするとともに
          terminal_rssi[num] = {};
          // カウント回数もゼロにする
          terminal_count[num] = 0;
        }
      }
    }
  // 現在時刻の取得
  var nowtime = new Date();
  // 2秒先の時刻を得て、変数の中身を空にする
  nowtime.setSeconds(nowtime.getSeconds() + 2);
  func_assoc_array(nowtime.getSeconds());
  // さらに1秒先の時刻を得て、変数の中身を空にする
  nowtime.setSeconds(nowtime.getSeconds() + 1);
  func_assoc_array(nowtime.getSeconds());
  // さらに1秒先の時刻を得て、変数の中身を空にする
  nowtime.setSeconds(nowtime.getSeconds() + 1);
  func_assoc_array(nowtime.getSeconds());

  // デバッグ情報表示
  var debugtime = new Date();
  debugtime.setSeconds(debugtime.getSeconds() - 1);
  document.getElementById("debug_terminal_count1").value = terminal_count[debugtime.getSeconds()];
  document.getElementById("debug_terminal_rssi1").value = JSON.stringify(terminal_rssi[debugtime.getSeconds()]);
  debugtime.setSeconds(debugtime.getSeconds() - 1);
  document.getElementById("debug_terminal_count2").value = terminal_count[debugtime.getSeconds()];
  document.getElementById("debug_terminal_rssi2").value = JSON.stringify(terminal_rssi[debugtime.getSeconds()]);
  debugtime.setSeconds(debugtime.getSeconds() - 1);
  document.getElementById("debug_terminal_count3").value = terminal_count[debugtime.getSeconds()];
  document.getElementById("debug_terminal_rssi3").value = JSON.stringify(terminal_rssi[debugtime.getSeconds()]);

  // スキャン停止時にトップに戻すモードの場合は
  if ( return_top_when_scan_stopped ) {
    // スキャン中にスキャンが止まったら
    if ( !(LEscanobject.active) ) {
      // 問答無用で起動画面に戻す
      return_top('operator');
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

// 動作環境テスト(パフォーマンス測定以外)
async function check_enviroment(){
  // 表示するwindowのハンドル
  var window_origin  = document.getElementById("1_1");
  var window_fail    = document.getElementById("2_1");
  var window_retry   = document.getElementById("2_2");
  var window_success = document.getElementById("3_2");

  // 元のWindowを隠す
  window_origin.style.visibility = 'hidden';

  // Androidかどうかを確認
  if (navigator.userAgent.indexOf("Android") == -1){
    window_fail.style.visibility = 'visible';
    return;
  }

  // window_retry(画面2_2)のエラー内容を一旦全部閉じる
  document.getElementById("reason_1_header").style.display = 'none';
  document.getElementById("reason_2_header").style.display = 'none';
  document.getElementById("reason_3_header").style.display = 'none';
  document.getElementById("reason_4_header").style.display = 'none';
  document.getElementById("reason_5_header").style.display = 'none';
  document.getElementById("reason_6_header").style.display = 'none';

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
    // 走ったらリスナーを設定する
    navigator.bluetooth.addEventListener('advertisementreceived', found_terminal );
    // 3_2(パフォーマンス測定)画面を開く
    window_success.style.visibility = 'visible';
    // スキャン停止時にトップに戻さない設定で
    return_top_when_scan_stopped = false;
    // スキャン稼働チェックを回しつつ
    scan_running_checker = setInterval(check_scan_running,1000);
    // パフォーマンス測定を5秒間回す
    perfomance_checker = setTimeout(perfomance_check,1000 * perfomance_check_seconds);
  } catch (error) {
    if (error.name == 'InvalidStateError') {
      // スキャンがキャンセルされたら、画面 1_1 に戻す
      window_origin.style.visibility = 'visible';
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

// 動作環境テスト(パフォーマンス測定)
var perfomance_checker;
function perfomance_check() {
  // パフォーマンス(Bluetoothのスキャンが秒速何件行えるか)を測定
  // 現在時刻を得て
  var nowtime = new Date();
  // perfomance_check_seconds秒前から現在までの測定回数を得る
  var perfomance_count = 0;
  for(var s=0; s < perfomance_check_seconds; s++) {
    // 変数が定義されていたら加算する
    if(terminal_count[nowtime.getSeconds()]) {
      perfomance_count += terminal_count[nowtime.getSeconds()];
    }
    nowtime.setSeconds(nowtime.getSeconds() - 1);
  }

  // デバッグ情報表示
  document.getElementById("debug_performance").value = perfomance_count;

  // 測定結果を判定
  if ( perfomance_count < perfomance_check_seconds * 2) {
    // Bluetoothのスキャン頻度が不足していたら、
    // パフォーマンス不足を伝えるエラー画面を開く
    return_top(2);
    document.getElementById("reason_6_header").style.display = 'flex';
  } else {
    // Bluetoothのスキャン頻度が一定以上ならば、
    // スキャン停止時にトップに戻すモードに切り替え
    return_top_when_scan_stopped = true;
    // パフォーマンス測定画面を閉じて利用者画面を開く
    return_top("enduser");
  }
}

// スキャン時のリスナー
function found_terminal(event) {
  // 現在時刻の取得
  var nowtime = new Date();
  var nowtimestring = nowtime.toLocaleTimeString('ja-JP');
  var timenumber = nowtime.getSeconds();

  // terminal_countの回数を増やす
  if ( terminal_count[timenumber] ) {
    // 変数があれば1増やす
    terminal_count[timenumber]++;
  } else {
    // 変数がなかったら1とする
    terminal_count[timenumber] = 1;
  }

  // terminal_rssiに計測結果を投入する
  // その時刻(秒)の計測結果投入がはじめてなら、連想配列を生成する
  if ( !terminal_rssi[timenumber] ) {
    terminal_rssi[timenumber] = {};
  }
  // event.device.idの値の有無を確認する
  if ( !terminal_rssi[timenumber][event.device.id] ) {
    // 存在しない = 初発見なら、最初の値を入れる
    terminal_rssi[timenumber][event.device.id] = {raw_value: [event.rssi]};
  } else {
    // 存在するなら、値を修正する
    terminal_rssi[timenumber][event.device.id].raw_value.push(event.rssi);
  }
}
