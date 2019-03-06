#!/usr/bin/env python3

import cgi
import re

form = cgi.FieldStorage()

if "voice" in form:
    char = form.getvalue('char')
    a_file = form["voice"]
    out_fname = "./sound/%s.mp3" % char
    with open(out_fname, mode='wb') as out_f:
        out_f.write(a_file.file.read())

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
