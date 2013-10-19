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

vm.shouldShowArtistPage = ko.observable();
vm.shouldShowAlbumPage = ko.observable();

vm.onSearch = function() {
  artistSearch(vm.searchQuery(), vm.searchResults);
};

vm.onArtistClick = function(artist) {
  artistLookup(artist.href, function(artist) {
    vm.artistName(artist.name);
    vm.artistAlbums(artist.albums);
    vm.shouldShowArtistPage(true);
  });
};

vm.onAlbumClick = function(album) {
  albumLookup(album.href, function(album) {
    vm.shouldShowAlbumPage(true);
    vm.albumName(album.name);
    vm.albumTracks(album.tracks);
  });
};

ko.applyBindings(vm);
