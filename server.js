var express = require('express');
var app = express();
app.listen(8099);

app.get('/kana/audio', function(req, res) {
  var ch = decodeURIComponent(req.query.charactor);

  const execSync = require('child_process').execSync;
  const result = execSync('echo ' + ch + ' | kakasi -Ha -i utf-8');
  const yomi = result.toString().trim();
  const audio_fname = './sound/' + yomi + '.mp3';

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  const fs = require("fs");
  if (fs.existsSync(audio_fname)) {
    // res.send(audio_fname + '\n');
    // res.send(audio_fname);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ file: audio_fname, romaji: yomi }));
    console.log(audio_fname);
  }
});
