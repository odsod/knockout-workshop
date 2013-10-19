var ko = window.ko;

var artistSearch = function(searchQuery, callback) {
  $.getJSON('/search/1/artist.json', { q: searchQuery }, function(data) {
    callback(data.artists);
  });
};

var artistLookup = function(artistURI, callback) {
  $.getJSON('/lookup/1/.json', { uri: artistURI, extras: 'albumdetail' }, function(data) {
    data.artist.albums = data.artist.albums.map(function(item) { return item.album; });
    callback(data.artist);
  });
};

var albumLookup = function(albumURI, callback) {
  $.getJSON('/lookup/1/.json', { uri: albumURI, extras: 'track' }, function(data) {
    callback(data.album);
  });
};

var vm = {};

vm.searchQuery = ko.observable();
vm.searchResults = ko.observable();

vm.artistImage = ko.observable();
vm.artistName = ko.observable();
vm.artistLocation = ko.observable();
vm.artistAlbums = ko.observable();

vm.albumName = ko.observable();
vm.albumTracks = ko.observable();

vm.state = ko.observable('search');

vm.artistZ = 10;
vm.albumZ = 20;
vm.overlayZ = ko.computed(function() {
  switch (vm.state()) {
    case 'album': return vm.albumZ - 1;
    case 'artist': return vm.artistZ - 1;
  }
});

vm.back = function() {
  switch (vm.state()) {
    case 'album': vm.state('artist'); break;
    case 'artist': vm.state('search'); break;
  }
};

vm.onSearch = function() {
  artistSearch(vm.searchQuery(), vm.searchResults);
};

vm.onArtistClick = function(artist) {
  artistLookup(artist.href, function(artist) {
    vm.artistName(artist.name);
    vm.artistAlbums(artist.albums);
    vm.state('artist');
  });
};

vm.onAlbumClick = function(album) {
  albumLookup(album.href, function(album) {
    vm.albumName(album.name);
    vm.albumTracks(album.tracks);
    vm.state('album');
  });
};

ko.applyBindings(vm);
