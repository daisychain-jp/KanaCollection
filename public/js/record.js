import { record } from '/vmsg/vmsg.js';

var recordClickListener = function(e) {
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

var recordObj = { 'mode': 'record',
                  'clickListener': recordClickListener };
mainFunc(recordObj);
