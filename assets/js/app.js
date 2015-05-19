var opiumApp = angular.module('opiumApp', [
    'ngRoute',
    'opiumControllers',
    'opiumRestClient',
    'ngTouch',
    'cfp.hotkeys',
    'leaflet-directive',
    'LocalStorageModule'
]);

function routeProvider($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);

  $routeProvider
    .when('/login', {
      templateUrl: 'views/login.html',
      controller: 'LoginCtrl',
      reloadOnSearch: false
    })
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

