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
    xhr.open("GET", "/gallery?max_image=100", true);
    xhr.send(null);
  });
};

var clickFunc = function(image) {
  jQuery(function($){
    $("#image_area").append('<img class="disposable" src="' + image['src'] + '"/>');

    var audio_xhr = new XMLHttpRequest();

    // TODO: detech whether autoplay is supported and switch procedure using modernizr
    const platform = window.navigator.platform;
    if (['iPhone', 'iPad', 'iPod'].indexOf(platform) !== -1) {
      audio_xhr.open("GET", "/voice?syllables=" + encodeURIComponent(image['yomi'].join(',')), false);
      audio_xhr.send(null);
      if (audio_xhr.status == 200) {
        overlayFunc(JSON.parse(audio_xhr.response));
      }
    } else {
      audio_xhr.onreadystatechange = function() {
        if (audio_xhr.readyState == 4 && audio_xhr.status == 200) {
          overlayFunc(audio_xhr.response);
        }
      };
      audio_xhr.responseType = 'json';
      audio_xhr.open("GET", "/voice?syllables=" + encodeURIComponent(image['yomi'].join(',')), true);
      audio_xhr.send(null);
    }
  });
};
mainFunc(clickFunc);

var overlayFunc = function(res_json) {
  const files = res_json['files'];
  const hiragana = res_json['hiragana'];
  const hiraganaArr = res_json['hiragana'];

  jQuery(function($){
    $("#overlay").fadeIn();
  });

  // xxx
  const kanaDiv = document.getElementById('image_area');
  var kanaTable = document.createElement('table');
  kanaTable.className = 'disposable';
  kanaDiv.appendChild(kanaTable);
  var tr = document.createElement('tr');
  kanaTable.appendChild(tr);
  var td = document.createElement('td');
  td.innerText = res_json['hiragana'].join('');
  tr.appendChild(td);

  var i = 0;
  var audio = document.getElementById('audio');
  while (files[i] == null) {
    if (i++ >= files.length) {
      return;
    }
  }
  audio.src = files[i++];
  audio.load();
  audio.play();

  audio.onended = function() {
    if (i < files.length){
      while (files[i] == null) {
        if (i++ >= files.length) {
          return;
        }
      }
      audio.src = files[i++];
      audio.load();
      audio.play();
    }
  };
};
