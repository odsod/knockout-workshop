var ko = window.ko;

var vm = {};

vm.searchQuery = ko.observable('');
vm.searchResults = ko.observable([]);
vm.shouldShowArtistPage = ko.observable(false);
vm.artist = ko.observable({});

vm.search = function() {
  $.getJSON('/artist/search', { q: vm.searchQuery() }, vm.searchResults);
};

vm.artistClicked = function(_, e) {
  var artist = ko.dataFor(e.target);
  vm.shouldShowArtistPage(true);
};

ko.applyBindings(vm);
