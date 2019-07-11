import { record } from "./vmsg/vmsg.js";

var Main = function() {
  this.mode = "main";
};
Main.prototype.start = function() {
  var HIRAGANA = [["わ", "ら", "や", "ま", "は", "な", "た", "さ", "か", "あ"],
                  ["を", "り",   "", "み", "ひ", "に", "ち", "し", "き", "い"],
                  ["ん", "る", "ゆ", "む", "ふ", "ぬ", "つ", "す", "く", "う"],
                  [  "", "れ",   "", "め", "へ", "ね", "て", "せ", "け", "え"],
                  [  "", "ろ", "よ", "も", "ほ", "の", "と", "そ", "こ", "お"]];

  var cell = [];
  var main = document.getElementById("main");
  var xhr = new Array(HIRAGANA.length);
  for (var i = 0; i < HIRAGANA.length; i++) {
    var tr = document.createElement("tr");
    cell[i] = [];
    var dan = HIRAGANA[i];
    xhr[i] = new Array(dan.length);
    for (var j = 0; j < dan.length; j++) {
      var td = document.createElement("td");
      var moji = dan[j];
      var hex_moji = moji.charCodeAt(0).toString(16);
      // td.addEventListener("click", play_sound);
      // td.addEventListener("click", record_sound);
      td.addEventListener("click", this.click);
      td.className = "cell " + this.mode + " inactive";
      td.id = "";
      td.innerHTML = moji;
      td.setAttribute("data-unicode", hex_moji);
      td.y = i;
      td.x = j;
      cell[i][j] = td;
      tr.appendChild(td);

      var that = this;

      (function(x, y) {
        var moji = dan[j];
        xhr[x][y] = new XMLHttpRequest();

        xhr[x][y].onreadystatechange = function() {
          if (xhr[x][y].readyState == 4 && xhr[x][y].status == 200) {
            var audio_res = xhr[x][y].response;

            cell[x][y].className = "cell " + that.mode + " active";

            var audio = document.createElement("audio");
            var source = document.createElement("source");
            source.src = audio_res[0];
            audio.appendChild(source);
            cell[x][y].appendChild(audio);
          }
        };
        xhr[x][y].responseType = 'json';
        xhr[x][y].open("GET", "http://www.daisychain.jp:8099/kana/audio?syllables=" + encodeURIComponent(moji), true);
        xhr[x][y].send(null);
      })(i, j);
    }
    main.appendChild(tr);
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
    var audio = td.lastChild;
    audio.load();
    audio.play();
  }
};
