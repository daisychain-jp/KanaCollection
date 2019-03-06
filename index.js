import { record } from "./vmsg/vmsg.js";

// let recordButton = document.getElementById("recordButton");
// recordButton.onclick = function() {
//   record({wasmURL: "vmsg.wasm"}).then(blob => {
//     console.log("Recorded MP3", blob);
//     var url = URL.createObjectURL(blob);
//     var preview = document.createElement('audio');
//     preview.controls = true;preview.src = url;
//     document.body.appendChild(preview);
//   });
// };

var W = 10, H = 5, BOMB = 10, cell = [], opened = 0;

var HIRAGANA = [["わ", "ら", "や", "ま", "は", "な", "た", "さ", "か", "あ"],
                ["を", "り",   "", "み", "ひ", "に", "ち", "し", "き", "い"],
                ["ん", "る", "ゆ", "む", "ふ", "ぬ", "つ", "す", "く", "う"],
                [  "", "れ",   "", "め", "へ", "ね", "て", "せ", "け", "え"],
                [  "", "ろ", "よ", "も", "ほ", "の", "と", "そ", "こ", "お"]];

// function init() {

var main = document.getElementById("main");
for (var i = 0; i < HIRAGANA.length; i++) {
  var tr = document.createElement("tr");
  var dan = HIRAGANA[i];
  cell[i] = [];
  for (var j = 0; j < dan.length; j++) {
    var td = document.createElement("td");
    var moji = dan[j];
    var hex_moji = moji.charCodeAt(0).toString(16);
    td.addEventListener("click", click);
    // td.addEventListener("dblclick", dblclick);
    td.className = "cell inactive";
    td.id = hex_moji;
    td.innerHTML = moji;
    td.setAttribute("data-unicode", hex_moji);
    td.y = i;
    td.x = j;
    cell[i][j] = td;
    tr.appendChild(td);
  }
  main.appendChild(tr);
}
// }

var first_ch = "あ".charCodeAt(0);
var last_ch = "ん".charCodeAt(0);
for (var ch = first_ch; ch <= last_ch; ch++) {
  var http = new XMLHttpRequest();
  http.onload = function(oEvent) {
    // console.log(z + " status: " + http.status);
    if (oEvent.target.status != 404) {
      var splitted_res = oEvent.target.responseURL.split("/")
      var moji_code = splitted_res[splitted_res.length - 1].substring(0, 4)
      var td = document.getElementById(moji_code);
      td.className = "cell active";
    }
  };
  // http.open('HEAD', "http://www.daisychain.jp/~t.inamori/kana/sound/304a.mp3", true);
  // http.open('HEAD', "./sound/304a.mp3", true);
  http.open('HEAD', "./sound/" + ch.toString(16) + ".mp3", true);
  http.send();
}


function click(e) {
  var td = e.target;
  if (td.className == "cell active") {
    var audio = document.getElementById("audio");
    var sources = audio.getElementsByTagName("source");
    Array.prototype.forEach.call(sources, function(source) {
      audio.removeChild(source);
    });

    var new_source = document.createElement("SOURCE");
    var code = td.getAttribute("data-unicode");
    new_source.src = "./sound/" + code + ".mp3";
    audio.appendChild(new_source);
    audio.load();
    audio.play();
  }
}

// function click(e) {
//   var form = document.forms.namedItem("voice_upload");
//   // var fd = new FormData(form);
//   var fd = new FormData();
//   fd.append("aaa", "value_a");
//   // console.log("Clicked!");
//   console.log(fd);
//   var oReq = new XMLHttpRequest();
//   oReq.onload = function(oEvent) {
//     if (oReq.status == 200) {
//       console.log("Uploaded!");
//     } else {
//       // oOutput.innerHTML = "Error " + oReq.status + " occurred when trying to upload your file.<br \/>";
//       console.log("Error!");
//     }
//   };
//   oReq.open("POST", "http://www.daisychain.jp/~t.inamori/kana/upload.py", true);
//   oReq.send(fd);
// }

// function dblclick(e) {
//   record({wasmURL: "./vmsg/vmsg.wasm"}).then(blob => {
//     console.log("Recorded MP3", blob);
//     var url = URL.createObjectURL(blob);
//     var preview = document.createElement('audio');
//     preview.controls = true;
//     preview.src = url;
//     document.body.appendChild(preview);
//   });
// }

// function dblclick(e) {
//   record({wasmURL: "./vmsg/vmsg.wasm"}).then(blob => {
//     console.log("Recorded MP3", blob);
//     // var url = URL.createObjectURL(blob);
//     // var preview = document.createElement('audio');
//     // preview.controls = true;
//     // preview.src = url;
//     // document.body.appendChild(preview);

//     // uploadFormData.append("data", new Blob([data], {type:"application/octet-stream"}));

//     // var form = document.createElement('form');
//     // var uploadFormData = new FormData(form);
//     // var uploadFormData = new FormData(document.getElementById("voice_upload"));
//     // uploadFormData.append("voice", blob, {type:"application/octet-stream"});
//     // uploadFormData.append( "hoge", "fuga" );
//     // document.body.appendChild(form);

//     var form = document.forms.namedItem("voice_upload");
//     form.addEventListener('submit', function(ev) {
//     //   var oOutput = document.querySelector("div"),
//       // var oData = new FormData(form);
//       var oData = new FormData();

//     //   oData.append("CustomField", "This is some extra data");
//       // uploadFormData.append("voice", blob, {type:"application/octet-stream"});
//       oData.append("aaa", "value_a");
//       var oReq = new XMLHttpRequest();
//       oReq.open("POST", "http://www.daisychain.jp/~t.inamori/kana/upload.py", true);
//     //   oReq.onload = function(oEvent) {
//     //     if (oReq.status == 200) {
//     //       oOutput.innerHTML = "Uploaded!";
//     //     } else {
//     //       oOutput.innerHTML = "Error " + oReq.status + " occurred when trying to upload your file.<br \/>";
//     //     }
//     //   };

//       oReq.send(oData);
//       ev.preventDefault();
//     }, false);
//   });
// }

// var g_blob;

function dblclick(e) {
  record({wasmURL: "./vmsg/vmsg.wasm"}).then(blob => {
    var url = URL.createObjectURL(blob);
    var preview = document.createElement('audio');
    preview.controls = true;
    preview.src = url;
    document.body.appendChild(preview);

    var button = document.createElement('button');
    // var form = document.createElement('form');
    // var submit = document.createElement('input');
    // form.controls = true;
    // form.src = url;
    button.setAttribute('type', 'button');
    button.setAttribute('name', 'aaa');
    button.setAttribute('value', 'send');
    // submit.setAttribute('type', 'submit');
    // submit.setAttribute('name', 'aaa');
    // submit.setAttribute('value', 'so-shin');
    // form.appendChild(submit);
    button.addEventListener('click', function(ev) {
      console.log("Recorded MP3", blob);
      // console.log("Submit");
      var fd = new FormData();
      fd.append("voice", blob, {type:"application/octet-stream"});
      fd.append("char", e.target.getAttribute("data-unicode"));
      // fd.append("value", "ppp");
      var oReq = new XMLHttpRequest();
      oReq.onload = function(oEvent) {
        if (oReq.status == 200) {
          console.log("Uploaded!");
        } else {
          // oOutput.innerHTML = "Error " + oReq.status + " occurred when trying to upload your file.<br \/>";
          console.log("Error!" + oReq.status);
          // console.log(fd);
        }
      };
      oReq.open("POST", "http://www.daisychain.jp/~t.inamori/kana/upload.py", true);
      oReq.send(fd);
    });
    document.body.appendChild(button);


    // console.log("Recorded MP3", blob);
    // var fd = new FormData();
    // fd.append("voice", blob, {type:"application/octet-stream"});
    // var oReq = new XMLHttpRequest();
    // oReq.onload = function(oEvent) {
    //   if (oReq.status == 200) {
    //     console.log("Uploaded!");
    //   } else {
    //     // oOutput.innerHTML = "Error " + oReq.status + " occurred when trying to upload your file.<br \/>";
    //     console.log("Error!");
    //   }
    // };
    // oReq.open("POST", "http://www.daisychain.jp/~t.inamori/kana/upload.py", true);
    // oReq.send(fd);
  });
}
