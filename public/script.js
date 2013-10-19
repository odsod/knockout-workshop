var ko = window.ko;

var vm = {};

vm.searchQuery = ko.observable();
vm.searchResults = ko.observable();

vm.artistImage = ko.observable();
vm.artistName = ko.observable();
vm.artistLocation = ko.observable();
vm.artistAlbums = ko.observable();

vm.albumName = ko.observable();

vm.shouldShowArtistPage = ko.observable();
vm.shouldShowAlbumPage = ko.observable();

vm.onSearch = function() {
  $.getJSON('/artist/search', { q: vm.searchQuery() }, vm.searchResults);
};

vm.onArtistClick = function(artist) {
  vm.shouldShowArtistPage(true);
  $.getJSON('/artist/lookup', { uri: artist.uri }, function(result) {
    vm.artistName(result.name);
    vm.artistAlbums(result.albums);
  });
};

vm.onAlbumClick = function(album) {
  vm.shouldShowAlbumPage(true);
  vm.albumName(album.name);
};

ko.applyBindings(vm);
