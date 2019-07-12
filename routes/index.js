var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title : 'Express' });
});

router.get('/audio', function(req, res, next) {
  const fs = require("fs");
  const str = decodeURIComponent(req.query.syllables);
  const execSync = require('child_process').execSync;

  var files = [];
  const syllables = str.split(',');
  for (var i = 0; i < syllables.length; i++) {
    const result = execSync('echo ' + syllables[i] + ' | kakasi -Ha -i utf-8');
    const yomi = result.toString().trim();
    const fname = 'data/voice/' + yomi + '.mp3';
    if (fs.existsSync('public/' + fname)) {
      files.push(fname);
    } else {
      files.push(null);
    }
  }

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(files));
});

router.get('/gallery', function(req, res, next) {
  const fs = require("fs");
  const max_image = decodeURIComponent(req.query.max_image);
  const gallery = JSON.parse(fs.readFileSync('public/data/gallery.json', 'utf8'));
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

module.exports = router;
