var request = require('request'),
    _ = require('lodash');

exports.artistSearchQuery = function(query) {
  return function(callback) {
    request({
      url: 'http://ws.spotify.com/search/1/artist.json',
      qs: { q: query }
    }, function(err, response, body) {
      callback(err, JSON.parse(body).artists);
    });
  };
};

exports.artistAlbumsQuery = function(uri) {
  return function(callback) {
    request({
      url: 'http://ws.spotify.com/lookup/1/.json',
      qs: { uri: uri, extras: 'albumdetail' }
    }, function(err, response, body) {
      var artist = JSON.parse(body).artist,
          albums = artist.albums;
      albums = albums.filter(function(item) {
        return item.album.artist === artist.name;
      });
      albums = albums.filter(function(item) {
        return item.album.name.indexOf('Live') === -1;
      });
      albums = _.unique(albums, function(item) {
        return item.album.name.replace(/\W/g, '');
      });
      albums = albums.map(function(item) {
        return {
          name: item.album.name,
          released: item.album.released,
          uri: item.album.href
        };
      });
      albums = albums.sort(function(lhs, rhs) {
        return parseInt(lhs.released, 10) - parseInt(rhs.released, 10);
      });
      callback(err, albums);
    });
  };
};

exports.artistProfileQuery = function(uri) {
  return function(callback) {
    var url = 'http://developer.echonest.com/api/v4/artist/profile?' +
              'api_key=N1WQYA4MPBEWOP9UF&format=json&id=' + uri.replace(/^spotify:/, 'spotify-WW:') +
              '&bucket=biographies&bucket=images&bucket=years_active&bucket=artist_location';
    request(url, function(err, response, body) {
      var artistData = JSON.parse(body).response.artist,
          profile = {};
      artistData.biographies = artistData.biographies.filter(function(bio) {
        return bio.text.indexOf('...') === -1 || bio.text.length > 200;
      });
      artistData.images = artistData.images.filter(function(image) {
        return image['aspect_ratio'] < 1.5;
      });
      profile.biography = artistData.biographies[0] &&
                          artistData.biographies[0].text.split('. ').slice(0, 2).join('. ') + '.';
      profile.image = artistData.images[0] && artistData.images[0].url;
      profile.yearsActive = artistData['years_active'].map(function(range) {
        return range.start + ' - ' + (range.end || 'present');
      }).join(', ').trim();
      profile.location = artistData['artist_location'].location || artistData['artist_location'].country;
      callback(err, profile);
    });
  };
};
