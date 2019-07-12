var express = require('express');
var router = express.Router();
const multer = require('multer');
const upload = multer();
const fs = require('fs');

router.get('/', function(req, res, next) {
  res.render('index', { title : 'Express' });
});

router.get('/voice', function(req, res, next) {
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

router.post('/voice', upload.any(), (req, res) => {
  const syllable = decodeURIComponent(req.query.syllable);
  const execSync = require('child_process').execSync;
  const result = execSync('echo ' + syllable + ' | kakasi -Ha -i utf-8');
  const romaji = result.toString().trim();
  const raw_voice = 'public/data/voice/' + romaji + '_raw.mp3';
  const trim_voice = 'public/data/voice/' + romaji + '.mp3';

  fs.writeFile(raw_voice, req.files[0].buffer, (err) => {
    if (err) {
      console.log('Error: ', err);
      res.status(500).send('An error occurred: ' + err.message);
    } else {
      execSync('ffmpeg -y -i ' + raw_voice + ' -af silenceremove=start_periods=1:start_duration=0:start_threshold=-40dB:detection=peak ' + trim_voice);
      res.status(200).send('ok');
      fs.unlink(raw_voice, (err) => {
        if (!err) {
          console.log('raw file removed');
        }
      });
    }
  });

});


router.get('/gallery', function(req, res, next) {
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
