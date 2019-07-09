export var Gallery = function() {
  var body = document.body;
  var ul = document.createElement("ul");
  ul.setAttribute("class", "box-list");
  body.appendChild(ul);

  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var gallery_res = xhr.response;

      // cell[x][y].id = audio_res.romaji;
      // cell[x][y].className = "cell " + that.mode + " active";
      // var audio = document.createElement("audio");
      // var source = document.createElement("source");
      // audio.id = "audio_" + audio_res.romaji;
      // source.src = audio_res.file;
      // audio.appendChild(source);
      // document.body.appendChild(audio);

      gallery_res.forEach(function(image){
        var li = document.createElement("li");
        var div = document.createElement("div");
        var img = document.createElement("img");
        img.setAttribute("src", image["url"]);
        div.appendChild(img);
        li.appendChild(div);
        ul.appendChild(li);
      });
    }
  };
  xhr.responseType = 'json';
  xhr.open("GET", "http://www.daisychain.jp:8099/kana/gallery?max_image=6", true);
  xhr.send(null);

};
Gallery.prototype.start = function() {
};
