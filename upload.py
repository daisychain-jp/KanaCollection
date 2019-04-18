#!/usr/bin/env python3

import cgi
import subprocess
from datetime import datetime

form = cgi.FieldStorage()

log_fname = './log/{0}_upload.log'.format(datetime.now().strftime("%Y%m%d_%H%M%S"))
ffmpeg = '/home/tinamori/usr/bin/ffmpeg'

if "voice" in form:
    char = form.getvalue('char')
    up_file = form["voice"]
    trim_sound_fname = './sound/{}.mp3'.format(char)
    orig_sound_fname = './sound_orig/{}.mp3'.format(char)
    with open(orig_sound_fname, mode='wb') as work_f:
        work_f.write(up_file.file.read())
    with open(log_fname, mode='w') as log_f:
        subprocess.run([ffmpeg, '-i', orig_sound_fname, '-af', 'silenceremove=start_periods=1:start_duration=0:start_threshold=-40dB:detection=peak', trim_sound_fname], stdout=log_f, stderr=log_f)

print("Content-Type: text/html;")
print("")
print("<!DOCTYPE html>")
print("<html lang='ja'>")
print("<head>")
print("    <meta charset='utf-8'>")
print("    <title>hello world.</title>")
print("</head>")
print("<body>")
print("    <h1>hello world.</h1>")
print("</body>")
print("</html>")
