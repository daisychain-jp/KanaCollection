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
