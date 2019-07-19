var playMain = function () {
  const onpyoArr = [SEION, DAKUON, YOUON, YOUDAKUON];

  onpyoArr.forEach(function(onpyo) {
    createVoiceTable(onpyo, function(table){
      var div = document.getElementById('tables');
      div.appendChild(table);
    });
  });
};
playMain();
