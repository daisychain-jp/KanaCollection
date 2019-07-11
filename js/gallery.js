import * as $ from '../node_modules/jquery/dist/jquery.js';

export var Gallery = function() {
  jQuery(function($){
    $(".close").click(function() {
      $("#overlay").fadeOut();
      $('.image').remove();
    });
    $(".overlay-inner").click(function(event){
      event.stopPropagation();
    });
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
        div.appendChild(img);
        li.appendChild(div);
        ul.appendChild(li);

        jQuery(function($){
          $('body').on('click', '#open-btn' + index.toString(), function() {
            $("#image_area").append('<img class="image" src="' + image['src'] + '"/>');
            $("#overlay").fadeIn();

            var audio_xhr = new XMLHttpRequest();
            audio_xhr.onreadystatechange = function() {
              if (audio_xhr.readyState == 4 && audio_xhr.status == 200) {
                var audio_res = audio_xhr.response;

                var i = 0;
                var audio = document.getElementById('audio');
                while (audio_res[i] == null) {
                  i++;
                }
                if (i >= audio_res.length) {
                  return;
                }
                audio.src = audio_res[i++];
                audio.load();
                audio.play();
                audio.onended = function() {
                  if(i < audio_res.length && audio_res[i] != null){
                    audio.src = audio_res[i++];
                    audio.load();
                    audio.play();
                  }
                };
              }
            };
            audio_xhr.responseType = 'json';
            audio_xhr.open("GET", "http://www.daisychain.jp:8099/kana/audio?syllables=" + encodeURIComponent(image['yomi'].join(',')), true);
            audio_xhr.send(null);
          });
        });
      });
    }
  };
  xhr.responseType = 'json';
  xhr.open("GET", "http://www.daisychain.jp:8099/kana/gallery?max_image=6", true);
  xhr.send(null);
};
Gallery.prototype.start = function() {
};
