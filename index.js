import { record } from "./vmsg/vmsg.js";

var W = 10, H = 5, BOMB = 10, cell = [], opened = 0;

var HIRAGANA = [["わ", "ら", "や", "ま", "は", "な", "た", "さ", "か", "あ"],
                ["を", "り",   "", "み", "ひ", "に", "ち", "し", "き", "い"],
                ["ん", "る", "ゆ", "む", "ふ", "ぬ", "つ", "す", "く", "う"],
                [  "", "れ",   "", "め", "へ", "ね", "て", "せ", "け", "え"],
                [  "", "ろ", "よ", "も", "ほ", "の", "と", "そ", "こ", "お"]];

var main = document.getElementById("main");
for (var i = 0; i < HIRAGANA.length; i++) {
  var tr = document.createElement("tr");
  var dan = HIRAGANA[i];
  cell[i] = [];
  for (var j = 0; j < dan.length; j++) {
    var td = document.createElement("td");
    var moji = dan[j];
    var hex_moji = moji.charCodeAt(0).toString(16);
    td.addEventListener("click", play_sound);
    // td.addEventListener("click", record_sound);
    td.className = "cell inactive";
    td.id = hex_moji;
    td.innerHTML = moji;
    td.setAttribute("data-unicode", hex_moji);
    td.y = i;
    td.x = j;
    cell[i][j] = td;
    tr.appendChild(td);
  }
  main.appendChild(tr);
}

var first_ch = "あ".charCodeAt(0);
var last_ch = "ん".charCodeAt(0);
for (var ch = first_ch; ch <= last_ch; ch++) {
  var http = new XMLHttpRequest();
  http.onload = function(oEvent) {
    if (oEvent.target.status != 404) {
      var splitted_res = oEvent.target.responseURL.split("/");
      var moji_code = splitted_res[splitted_res.length - 1].substring(0, 4);
      var td = document.getElementById(moji_code);
      td.className = "cell active";

      var audio = document.createElement("audio");
      var source = document.createElement("source");
      audio.id = "audio_" + moji_code;
      source.src = "./sound/" + moji_code + ".mp3";
      audio.appendChild(source);
      document.body.appendChild(audio);
    }
  };
  http.open('HEAD', "./sound/" + ch.toString(16) + ".mp3", true);
  http.send();
}

function play_sound(e) {
  var td = e.target;
  if (td.className == "cell active") {
    var audio = document.getElementById("audio_" + td.id);
    audio.load();
    audio.play();
  }
}

function upload_sound(e) {
  record({wasmURL: "./vmsg/vmsg.wasm"}).then(blob => {
    var url = URL.createObjectURL(blob);
    var preview = document.createElement('audio');
    preview.controls = true;
    preview.src = url;
    document.body.appendChild(preview);

    var button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.setAttribute('name', 'aaa');
    button.setAttribute('value', 'send');
    button.addEventListener('click', function(ev) {
      console.log("Recorded MP3", blob);
      var fd = new FormData();
      fd.append("voice", blob, {type:"application/octet-stream"});
      fd.append("char", e.target.getAttribute("data-unicode"));
      var oReq = new XMLHttpRequest();
      oReq.onload = function(oEvent) {
        if (oReq.status == 200) {
          console.log("Uploaded!");
        } else {
          console.log("Error!" + oReq.status);
        }
      };
      oReq.open("POST", "http://www.daisychain.jp/~t.inamori/kana/upload.py", true);
      oReq.send(fd);
    });
    document.body.appendChild(button);
  });
}
