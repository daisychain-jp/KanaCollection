import { record } from "./vmsg/vmsg.js";

var Main = function() {
  this.mode = "main";
};
Main.prototype.start = function() {
    var cell = [];

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
        // td.addEventListener("click", play_sound);
        // td.addEventListener("click", record_sound);
        td.addEventListener("click", this.click);
        td.className = "cell " + this.mode + " inactive";
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
      var that = this;
      http.onload = function(oEvent) {
        if (oEvent.target.status != 404) {
          var splitted_res = oEvent.target.responseURL.split("/");
          var moji_code = splitted_res[splitted_res.length - 1].substring(0, 4);
          var td = document.getElementById(moji_code);
          td.className = "cell " + that.mode + " active";

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
};
Main.prototype.click = function(e) {};

export var Record = function() {
  this.mode = "record";
};
Record.prototype = new Main();
Record.prototype.click = function(e) {
  record({wasmURL: "./vmsg/vmsg.wasm"}).then(blob => {
    var control = document.getElementById("control");
    while (control.hasChildNodes()) {
      var first = control.firstChild;
      control.removeChild(first);
    }

    var url = URL.createObjectURL(blob);
    var preview = document.createElement('audio');
    preview.controls = true;
    preview.src = url;
    control.appendChild(preview);

    var button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.setAttribute('name', 'upload_button');
    button.setAttribute('value', 'upload');
    button.innerHTML = "送信";
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
        location.reload();
      };
      oReq.open("POST", "upload.py", true);
      oReq.send(fd);
    });
    control.appendChild(button);

    var cxl_btn = document.createElement('button');
    cxl_btn.setAttribute('type', 'button');
    cxl_btn.setAttribute('name', 'cancel_button');
    cxl_btn.setAttribute('value', 'cancel');
    cxl_btn.innerHTML = "キャンセル";
    cxl_btn.addEventListener('click', function(ev) {
      location.reload();
    });
    control.appendChild(cxl_btn);
  });
};

export var Play = function() {
  this.mode = "play";
};
Play.prototype = new Main();
Play.prototype.click = function(e) {
  var td = e.target;
  if (td.className == "cell play active") {
    var audio = document.getElementById("audio_" + td.id);
    audio.load();
    audio.play();
  }
};
