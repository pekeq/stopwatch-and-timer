/////
///// ストップウォッチ
/////

// タイマーと混ざらないように、ストップウォッチ関連の変数や関数の頭には 'sw_' をつける

// ストップウォッチの累積時間（単位：ミリ秒）
let sw_accumulated = 0;

// ストップウオッチの開始時刻（単位：ミリ秒）
let sw_start_time;

// 計測中に表示部を更新するタイマー
let sw_timer = null;


// スタートボタン
const sw_start_btn = document.getElementById('sw_start');
// 停止ボタン
const sw_stop_btn = document.getElementById('sw_stop');
// 停止ボタン
const sw_reset_btn = document.getElementById('sw_reset');

// 経過時間の表示部
const sw_display = document.getElementById('sw_display');


// lapseに指定した時間（ミリ秒）を、「分:秒.ミリ秒」の形式にする
function sw_format_lapse(lapse) {
    // 分
    // lapseを、 1000 * 60 = 60000 で割った商
    const minutes = Math.floor(lapse / 60000);
    // 秒
    // minutesの余り（=lapseを60000で割った余り）を、 1000 で割った商
    const seconds = Math.floor((lapse % 60000) / 1000);
    // ミリ秒
    const milliseconds = lapse % 1000;

    // 表示するテキストを整形する
    // 秒は２桁の数字、ミリ秒は３桁の数字にする
    const seconds_text = seconds.toString().padStart(2, '0');
    const millseconds_text = milliseconds.toString().padStart(3, '0');
    const text = `${minutes}:${seconds_text}.${millseconds_text}`;

    return text;
}


// 経過時間を表示する
function sw_display_lapse() {
    // 前回ストップするまでの累積時間
    let lapse = sw_accumulated;

    // もしタイマーが起動中（=ストップウォッチ計測中）だったら
    if (sw_timer) {
        // 経過時間を計算する
        // 前回ストップするまでの累積時間に、 (現在時刻 - 直近でスタートした時刻) を足す
        const now = Date.now();
        lapse += now - sw_start_time;
    }

    // 表示を更新する
    sw_display.innerText = sw_format_lapse(lapse);
}

// ストップウォッチ開始処理
function sw_start() {
    console.log('スタートボタンが押された');

    // すでに処理中なら何もしない
    if (sw_timer) {
        return;
    }

    // 開始時刻を現在時刻にする
    sw_start_time = Date.now();

    // 10ms = 1/100秒ごとに表示を更新するタイマー処理を起動する
    sw_timer = setInterval(sw_display_lapse, 10);
}

function sw_stop() {
    console.log('ストップボタンが押された');

    if (sw_timer) {
        // 表示更新用のタイマー処理を止める
        clearInterval(sw_timer);
        // タイマーが動いていないことを明示するためにnullをセット
        sw_timer = null;

        // 累積時間にストップするまでの時間を足す
        const now = Date.now();
        sw_accumulated += now - sw_start_time;
    }

    // 表示を更新
    sw_display_lapse();
}

function sw_reset() {
    console.log('リセットボタンが押された');

    // 開始時間をリセット（現在時刻にする）
    sw_start_time = Date.now();

    // 累積時間をリセット
    sw_accumulated = 0;

    // 表示を更新
    sw_display_lapse();
}

// ストップウォッチの初期化
function sw_initialize() {
    // sw_accumulatedや、sw_timerの初期化処理は、
    // letで宣言しているときに初期化済みなので、ここではやらなくていい

    // 表示部の初期化
    sw_display_lapse();

    // ボタンと処理の結びつけ
    sw_start_btn.addEventListener('click', sw_start);
    sw_stop_btn.addEventListener('click', sw_stop);
    sw_reset_btn.addEventListener('click', sw_reset);
}

// ストップウォッチ初期化処理の呼び出し
sw_initialize();



/////
///// タイマー
/////

// タイマーの残り時間（単位：秒）
let tm_remain = 0;

// カウントダウン処理のタイマー
let tm_timer = null;

// 残り時間の表示部
const tm_display = document.getElementById('tm_display');

function tm_format_remain(remain) {
    // 分
    const minutes = Math.floor(remain / 60);
    // 秒
    const seconds = remain % 60;

    // 表示するテキストを整形する
    const text = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    return text;
}

// 残り時間の表示
function tm_display_remain() {
    tm_display.innerText = tm_format_remain(tm_remain);
}

function tm_countdown() {
    // tm_remain(=残り時間) を1秒減らす
    tm_remain--;

    // 表示を更新
    tm_display_remain();

    // 残り時間がなくなった
    if (tm_remain <= 0) {
        // カウントダウン処理停止
        tm_stop();

        // 終了ダイアログ表示
        const tm_finish_modal = new bootstrap.Modal(document.getElementById('tm_finish_modal'));
        tm_finish_modal.show();
    }
}

// タイマー開始
function tm_start() {
    console.log('タイマー開始');

    // 残り時間がなかったら開始しない
    if (tm_remain <= 0) {
        return;
    }

    // すでに処理中だったら何もしない
    if (tm_timer) {
        return;
    }

    // カウントダウン処理開始
    tm_timer = setInterval(tm_countdown, 1000);
}

// タイマー停止
function tm_stop() {
    console.log('タイマー停止');

    // カウントダウンタイマー停止
    if (tm_timer) {
        clearInterval(tm_timer);
        tm_timer = null;
    }

    // 表示を更新
    tm_display_remain();
}

// タイマーリセット
function tm_reset() {
    console.log('タイマーリセット');

    // タイマー起動中だったら停止
    tm_stop();

    // 残り時間リセット
    tm_remain = 0;

    // 表示を更新
    tm_display_remain();
}

// 残り時間に追加
function tm_plus_button(element) {
    // クリックされた要素の data-plus を取得
    // data-plusには追加したい時間を秒単位で指定
    const plus_txt = element.dataset.plus;

    console.log('タイマー時間追加:', plus_txt);

    // 足し算できるように、plus_txtをNumber型に変換
    const plus = parseInt(plus_txt, 10);

    // tm_remainに時間を追加
    tm_remain += plus;

    // 表示を更新
    tm_display_remain();
}

function tm_initialize() {
    tm_display_remain();

    // ボタンと処理の結びつけ
    document.getElementById('tm_start').addEventListener('click', tm_start);
    document.getElementById('tm_stop').addEventListener('click', tm_stop);
    document.getElementById('tm_reset').addEventListener('click', tm_reset);

    // classにtm_plusを含む要素全てに対して
    document.querySelectorAll('.tm_plus').forEach((element) => {
        // クリック時の処理を定義
        element.addEventListener('click', (e) => {
            // e.target = clickイベントの発生した(=押された)要素
            tm_plus_button(e.target);
        });
    });
}

tm_initialize();
