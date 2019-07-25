import * as $ from '/jquery/dist/jquery.js';

var mainFunc = function(clickFunc) {
  jQuery(function($){
    $(".close").click(function() {
      $("#overlay").fadeOut();
      $('.disposable').remove();
    });
    $(".overlay-inner").click(function(event){
      event.stopPropagation();
    });

    var body = document.body;
    var ul = document.createElement("ul");
    ul.setAttribute("class", "box-list");
    body.appendChild(ul);

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 && xhr.status == 200) {
        var gallery_res = xhr.response;

        gallery_res.forEach(function(image, index){
          var li = document.createElement("li");
          var div = document.createElement("div");
          var img = document.createElement("img");
          img.setAttribute("src", image["src"]);
          img.setAttribute("id", "open-btn" + index.toString());
          img.setAttribute("class", "open-btn");
          div.appendChild(img);
          li.appendChild(div);
          ul.appendChild(li);

          var selectImg = document.getElementById('open-btn' + index.toString());
          selectImg.addEventListener('click', function () {
            clickFunc(image);
          });
        });
      }
    };
    xhr.responseType = 'json';
    xhr.open("GET", "/images?max_size=100", true);
    xhr.send(null);
  });
};

var clickFunc = function(image) {
  jQuery(function($){
    $("#image_area").append('<img id="overlay_image" class="disposable" src="' + image['src'] + '"/>');

    createVoiceTable(image['yomi'], function(table){
      jQuery(function($){
        $("#overlay").fadeIn();
      });

      const kanaDiv = document.getElementById('kana');
      table.className += ' disposable';
      kanaDiv.appendChild(table);

      var audio = document.createElement('audio');
      audio.id = 'voice';
      audio.className = 'disposable';
      kanaDiv.appendChild(audio);

      var i = 0;
      var audioCol = table.getElementsByTagName('audio');
      audioCol.item(i).parentElement.className = 'cell play playing';
      audio.src = audioCol.item(i++).src;
      audio.load();
      audio.play();
      audio.onended = function() {
        if (i < audioCol.length){
          audioCol.item(i-1).parentElement.className = 'cell play active';
          audioCol.item(i).parentElement.className = 'cell play playing';
          audio.src = audioCol.item(i).src;
          audio.load();
          audio.play();
        } else if (i == audioCol.length){
          audioCol.item(i-1).parentElement.className = 'cell play active';
          requestTTS(image['name']);
        } else {
          audio.pause();
        }
        i += 1;
      };
    });
  });
};

var requestTTS = function(str) {
  const ttsXHR = new XMLHttpRequest();
  const platform = window.navigator.platform;
  if (['iPhone', 'iPad', 'iPod'].indexOf(platform) !== -1) {
    ttsXHR.open("GET", "/voice/tts?str=" + encodeURIComponent(str), false);
    ttsXHR.send(null);
    if (ttsXHR.status == 200) {
      const json_res = JSON.parse(ttsXHR.response);
      playTTS(json_res['voice']);
    }
  } else {
    ttsXHR.onreadystatechange = function() {
      if (ttsXHR.readyState == 4 && ttsXHR.status == 200) {
        playTTS(ttsXHR.response['voice']);
      }
    };
    ttsXHR.responseType = 'json';
    ttsXHR.open("GET", "/voice/tts?str=" + encodeURIComponent(str), true);
    ttsXHR.send(null);
  }
};

var playTTS = function(voice) {
  var audio = document.getElementById('voice');

  audio.src = voice;
  audio.load();
  audio.play();
};

mainFunc(clickFunc);
