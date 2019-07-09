var express = require('express');
var app = express();
app.listen(8099);
const fs = require("fs");

app.get('/kana/audio', function(req, res) {
  var ch = decodeURIComponent(req.query.charactor);

  const execSync = require('child_process').execSync;
  const result = execSync('echo ' + ch + ' | kakasi -Ha -i utf-8');
  const yomi = result.toString().trim();
  const audio_fname = './sound/' + yomi + '.mp3';

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  if (fs.existsSync(audio_fname)) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ file: audio_fname, romaji: yomi }));
    console.log(audio_fname);
  }
});

app.get('/kana/gallery', function(req, res) {
  const max_image = decodeURIComponent(req.query.max_image);
  const gallery = JSON.parse(fs.readFileSync('./json/gallery.json', 'utf8'));
  const images = gallery["images"];

  var res_size;
  if (typeof max_image === 'undefined') {
    res_size = images.length;
  } else {
    const max_image_int = parseInt(max_image);
    if (max_image_int < images.length && max_image_int > 0) {
      res_size = max_image_int;
    } else {
      res_size = images.length;
    }
  }

  // shuffle array
  var rand, temp, i;
  for (i = images.length - 1; i > 0; i -= 1) {
    rand = Math.floor((i + 1) * Math.random());
    temp = images[rand];
    images[rand] = images[i];
    images[i] = temp;
  }

  const res_images = images.slice(0, res_size);
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(res_images));
});
