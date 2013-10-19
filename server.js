var express = require('express'),
    app = express().use(express.static(require('path').join(__dirname, 'public')));

require('http').createServer(app).listen(3001);

require('http-proxy').createServer(function(req, res, proxy) {
  if (/^\/(search|lookup)/.test(req.url)) {
    proxy.proxyRequest(req, res, { host: 'ws.spotify.com', port: 80 });
  } else {
    proxy.proxyRequest(req, res, { host: 'localhost', port: 3001 });
  }
}).listen(3000);
