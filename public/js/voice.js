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

var playClickListener = function(e) {
  var td = e.target;
  if (td.className == "cell play active") {
    var audio = td.getElementsByTagName('audio')[0];
    if (audio === undefined) {
      return;
    }
    audio.onended = function() {
      audio.parentElement.className = 'cell play active';
      audio.onended = null;
    };
    audio.load();
    audio.play();
    audio.parentElement.className = 'cell play playing';
  }
};

var createVoiceTable = function(syllables, callback = null, control = 'play', clickListener = null) {
  var syllables_2d;
  if (Array.isArray(syllables[0]) == true) {
    syllables_2d = syllables;
  } else {
    syllables_2d = [syllables];
  }

  const aFunc = function (files, hiragana) {
    var table = document.createElement('table');
    table.className = 'onhyo';
    for (var i = 0; i < syllables_2d.length; i++) {
      var tr = document.createElement("tr");
      for (var j = 0; j < syllables_2d[i].length; j++) {
        var td = document.createElement("td");
        tr.appendChild(td);
        td.y = i;
        td.x = j;
        if (syllables_2d[i][j] != null) {
          td.innerText = syllables_2d[i][j];
          if (files[i * syllables_2d[0].length + j] != null) {
            td.className = 'cell ' + control + ' active';
            if (clickListener !== null) {
              td.addEventListener('click', clickListener);
            } else {
              td.addEventListener('click', playClickListener);
            }
            var audio = document.createElement("audio");
            audio.src = files[i * syllables_2d[0].length + j];
            td.appendChild(audio);
          } else {
            td.className = 'cell ' + control + ' inactive';
            if (clickListener !== null) {
              td.addEventListener('click', clickListener);
            }
          }
        }
      }
      table.appendChild(tr);
    }
    callback(table);
  };

  const audio_xhr = new XMLHttpRequest();

  // TODO: detech whether autoplay is supported and switch procedure using modernizr
  const platform = window.navigator.platform;
  if (['iPhone', 'iPad', 'iPod'].indexOf(platform) !== -1) {
    audio_xhr.open("GET", "/voice?syllables=" + encodeURIComponent(syllables_2d.join(',')), false);
    audio_xhr.send(null);
    if (audio_xhr.status == 200) {
      const json_res = JSON.parse(audio_xhr.response);
      aFunc(json_res['files'], json_res['hiragana']);
    }
  } else {
    audio_xhr.onreadystatechange = function() {
      if (audio_xhr.readyState == 4 && audio_xhr.status == 200) {
        aFunc(audio_xhr.response['files'], audio_xhr.response['hiragana']);
      }
    };
    audio_xhr.responseType = 'json';
    audio_xhr.open("GET", "/voice?syllables=" + encodeURIComponent(syllables_2d.join(',')), true);
    audio_xhr.send(null);
  }
};
