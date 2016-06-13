/*global process */
var fs = require('fs')
var http = require('http');
var https = require('https');
var express = require('express');
var jsforceAjaxProxy = require('./proxy');

var options = {
    key: fs.readFileSync('./http-server-with-jsforce-ajax-proxy/lib/ca.key'),
    cert: fs.readFileSync('./http-server-with-jsforce-ajax-proxy/lib/ca.crt'),
    maxAge: -1
};

var app = express();

app.configure(function () {
  app.set('port', process.env.PORT || 8443);
});

app.configure('development', function () {
  app.use(express.errorHandler());
});

app.all('/proxy/?*', jsforceAjaxProxy({ enableCORS: true }));

app.get('/', function(req, res) {
  res.send('JSforce AJAX Proxy');
});

app.use(express.static('./'));

/*
http.createServer(app).listen(app.get('port'), function () {
  console.log("Express server listening on port " + app.get('port'));
});
*/

var server = https.createServer(options, app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
