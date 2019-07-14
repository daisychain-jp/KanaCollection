var playClickListener = function(e) {
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

var playObj = { 'mode': 'play',
                'clickListener': playClickListener };
mainFunc(playObj);
