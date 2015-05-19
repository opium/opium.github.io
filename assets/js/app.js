var opiumApp = angular.module('opiumApp', [
    'ngRoute',
    'opiumControllers',
    'opiumRestClient',
    'ngTouch',
    'cfp.hotkeys',
    'leaflet-directive',
    'restangular'
]);

function routeProvider($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);

  $routeProvider
    .when('/:path\/:photo', {
      templateUrl: 'views/photo.html',
      controller: 'PhotoCtrl',
      reloadOnSearch: false
    })
    .when('/', {
      templateUrl: 'views/album-list.html',
      controller: 'AlbumListCtrl',
      reloadOnSearch: false
    })
    .when('/:path', {
      templateUrl: 'views/album-list.html',
      controller: 'AlbumListCtrl',
      reloadOnSearch: false
    })

  //.otherwise({
  //    redirectTo: '/'
  //})
}

opiumApp.config(['$routeProvider', '$locationProvider', routeProvider]);

opiumApp.config(['RestangularProvider', function(RestangularProvider) {
  RestangularProvider.setBaseUrl('http://api.opium.sitioweb.fr/app_dev.php/v1');
  RestangularProvider.setDefaultHeaders({
    Authorization: 'Basic ' + btoa('julien:deniau')
  });
}]);

