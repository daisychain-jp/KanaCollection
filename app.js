var express = require('express');
var path = require('path');
var routes = require('./routes/index.js');
var app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use('/', routes);

module.exports = app;
