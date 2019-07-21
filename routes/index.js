var express = require('express');
var router = express.Router();
const multer = require('multer');
const upload = multer();
const fs = require('fs');
const path = require('path');

router.get('/', function(req, res, next) {
  res.render('index', { title : 'Express' });
});

router.get('/voice', function(req, res, next) {
  const str = decodeURIComponent(req.query.syllables);
  const execSync = require('child_process').execSync;

  var files = [];
  var yomiArr = [];
  pushRes = function (yomigana, hyojigana = null) {
    if (yomigana != null) {
      const romaji = execSync('echo ' + yomigana + ' | kakasi -Ha -Ka -i utf-8').toString().trim();
      const hiragana = execSync('echo ' + yomigana + ' | kakasi -KH -i utf-8').toString().trim();
      const fname = 'data/voice/' + romaji + '.mp3';
      if (fs.existsSync('public/' + fname)) {
        files.push(fname);
      } else {
        files.push(null);
      }
      if (hyojigana != null) {
        yomiArr.push(hyojigana);
      } else {
        yomiArr.push(hiragana);
      }
    } else {
      files.push(null);
      yomiArr.push(null);
    }
  };

  const syllables = str.split(',');
  for (var i = 0; i < syllables.length; i++) {
    const syllable = syllables[i];
    if (syllable == 'ー') {
      if (i <= 0) {
        files.push(null);
        yomiArr.push(null);
      } else {
        const prevSyllable = syllables[i - 1];
        const prevRomajiStr = execSync('echo ' + prevSyllable + ' | kakasi -Ha -Ka -i utf-8').toString().trim();
        const prevLastRomaji = prevRomajiStr.charAt(prevRomajiStr.length - 1);
        switch (prevLastRomaji) {
        case 'a':
          pushRes('あ', 'ー');
          break;
        case 'i':
          pushRes('い', 'ー');
          break;
        case 'u':
          pushRes('う', 'ー');
          break;
        case 'e':
          pushRes('え', 'ー');
          break;
        case 'o':
          pushRes('お', 'ー');
          break;
        default:
          break;
        }
      }
    } else {
      pushRes(syllable);
    }
  }

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ 'files': files, 'hiragana': yomiArr}));
});

router.post('/voice', upload.any(), (req, res) => {
  const syllable = decodeURIComponent(req.query.syllable);
  const execSync = require('child_process').execSync;
  const result = execSync('echo ' + syllable + ' | kakasi -Ha -i utf-8');
  const romaji = result.toString().trim();
  const raw_voice = 'public/data/voice/' + romaji + '_raw.mp3';
  const trim_voice = 'public/data/voice/' + romaji + '.mp3';
  const ffmpegBin = path.join(__dirname, '../usr/bin/ffmpeg');

  fs.writeFile(raw_voice, req.files[0].buffer, (err) => {
    if (err) {
      console.log('Error: ', err);
      res.status(500).send('An error occurred: ' + err.message);
    } else {
      execSync(ffmpegBin + ' -y -i ' + raw_voice + ' -af silenceremove=start_periods=1:start_duration=0:start_threshold=-40dB:detection=peak ' + trim_voice);
      res.status(200).send('ok');
      fs.unlink(raw_voice, (err) => {
        if (!err) {
          console.log('raw file removed');
        }
      });
    }
  });
});

router.get('/voice/tts', function(req, res, next) {
  const ojtBin = path.join(__dirname, '../usr/bin/open_jtalk');
  const ojtDic = path.join(__dirname, '../usr/share/hts/dic');
  const ojtVoice = path.join(__dirname, '../usr/share/hts/voice/mei_normal.htsvoice');

  const str = decodeURIComponent(req.query.str);
  const execSync = require('child_process').execSync;
  const romaji = execSync('echo ' + str + ' | kakasi -Ha -Ka -Ja -i utf-8').toString().trim();
  const ttsFile = 'data/tts_voice/' + romaji + '.wav';
  execSync('echo ' + str + ' | ' + ojtBin + ' -x ' + ojtDic + ' -m ' + ojtVoice + ' -ow public/' + ttsFile);

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ 'voice': ttsFile}));
});

router.get('/images', function(req, res, next) {
  const max_image = decodeURIComponent(req.query.max_size);
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
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(res_images));
});

module.exports = router;
