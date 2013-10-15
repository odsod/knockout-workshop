var express = require('express'),
    http = require('http'),
    path = require('path'),
    async = require('async'),
    request = require('request'),
    _ = require('lodash');

var app = express();
app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, 'public')));

var api = require('./api.js');

app.get('/artist/search', function(req, res) {
  api.artistSearchQuery(req.query.q)(function(err, searchResult) {
    res.json(searchResult);
  });
});

app.get('/artist/lookup', function(req, res) {
  var uri = req.query.uri;
  async.parallel([
    api.artistAlbumsQuery(uri),
    api.artistProfileQuery(uri)
  ], function(err, results) {
    var albums = results[0],
        profile = results[1];
    profile.albums = albums;
    res.json(profile);
  });
});

http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
