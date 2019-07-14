import { record } from '/vmsg/vmsg.js';

const SEION = [['わ', 'ら', 'や', 'ま', 'は', 'な', 'た', 'さ', 'か', 'あ'],
               ['を', 'り', null, 'み', 'ひ', 'に', 'ち', 'し', 'き', 'い'],
               ['ん', 'る', 'ゆ', 'む', 'ふ', 'ぬ', 'つ', 'す', 'く', 'う'],
               [null, 'れ', null, 'め', 'へ', 'ね', 'て', 'せ', 'け', 'え'],
               [null, 'ろ', 'よ', 'も', 'ほ', 'の', 'と', 'そ', 'こ', 'お']];
const DAKUON = [['ぱ', 'ば', 'だ', 'ざ', 'が'],
                ['ぴ', 'び', 'ぢ', 'じ', 'ぎ'],
                ['ぷ', 'ぶ', 'づ', 'ず', 'ぐ'],
                ['ぺ', 'べ', 'で', 'ぜ', 'げ'],
                ['ぽ', 'ぼ', 'ど', 'ぞ', 'ご']];
const YOUON = [['りゃ','みゃ','ひゃ','にゃ','ちゃ','しゃ','きゃ'],
               [null, null, null, null  ,null  ,null  ,null],
               ['りゅ','みゅ','ひゅ','にゅ','ちゅ','しゅ','きゅ'],
               [null, null, null, null  ,null  ,null  ,null],
               ['りょ','みょ','ひょ','にょ','ちょ','しょ','きょ']];
const YOUDAKUON = [['ぴゃ', 'びゃ', 'じゃ', 'ぎゃ'],
                   [null,   null,   null,   null],
                   ['ぴゅ', 'びゅ', 'じゅ', 'ぎゅ'],
                   [null,   null,   null,   null],
                   ['ぴょ', 'びょ', 'じょ', 'ぎょ']];
// const TOKUSHUON;

var Main = function() {
  this.mode = "main";
};
Main.prototype.start = function() {
  const onTables = [SEION, DAKUON, YOUON, YOUDAKUON];

  onTables.forEach(function(onTable) {
    var cell = [];
    var div = document.getElementById('tables');
    var table = document.createElement('table');
    table.className = 'onhyo';
    for (var i = 0; i < onTable.length; i++) {
      var tr = document.createElement("tr");
      cell[i] = [];
      var dan = onTable[i];
      for (var j = 0; j < dan.length; j++) {
        var td = document.createElement("td");
        var syllable = dan[j];
        td.y = i;
        td.x = j;
        cell[i][j] = td;
        tr.appendChild(td);

        if (syllable != null) {
          td.addEventListener('click', this.click);
          td.className = "cell " + this.mode + " inactive";
          td.id = "";
          td.innerText = syllable;
        } else {
          continue;
        }
        var that = this;
      }
      table.appendChild(tr);
    }
    tables.appendChild(table);

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 && xhr.status == 200) {
        var audio_res = xhr.response;

        for (var i = 0; i < onTable.length; i++) {
          for (var j = 0; j < dan.length; j++) {
            var audio_file = audio_res[i * onTable[0].length + j];
            if (audio_file != null) {
              cell[i][j].className = "cell " + that.mode + " active";

              var audio = document.createElement("audio");
              var source = document.createElement("source");
              source.src = audio_file;
              audio.appendChild(source);
              cell[i][j].appendChild(audio);
            }
          }
        }
      }
    };
    xhr.responseType = 'json';
    xhr.open('GET', '/voice?syllables=' + encodeURIComponent(onTable.join(',')), true);
    xhr.send(null);
  }, this);
};
Main.prototype.click = function(e) {};

export var Record = function() {
  this.mode = "record";
};
Record.prototype = new Main();
Record.prototype.click = function(e) {
  var td = e.target;
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
      var fd = new FormData();
      fd.append('file', blob);
      var oReq = new XMLHttpRequest();
      oReq.onload = function(oEvent) {
        if (oReq.status == 200) {
          console.log("Uploaded!");
        } else {
          console.log("Error!" + oReq.status);
        }
        location.reload();
      };
      oReq.open('POST', '/voice?syllable=' + encodeURIComponent(td.innerText), true);
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
    var audio = td.getElementsByTagName('audio')[0];
    if (audio === undefined) {
      return;
    }
    audio.load();
    audio.play();
  }
};
