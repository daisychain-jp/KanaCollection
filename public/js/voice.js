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

var mainFunc = function(obj) {
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
          td.addEventListener('click', obj.clickListener);
          td.className = "cell " + obj.mode + " inactive";
          td.id = "";
          td.innerText = syllable;
        } else {
          continue;
        }
      }
      table.appendChild(tr);
    }
    div.appendChild(table);

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 && xhr.status == 200) {
        var audio_res = xhr.response;

        for (var i = 0; i < onTable.length; i++) {
          for (var j = 0; j < dan.length; j++) {
            var audio_file = audio_res[i * onTable[0].length + j];
            if (audio_file != null) {
              cell[i][j].className = "cell " + obj.mode + " active";

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
