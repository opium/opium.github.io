var opiumApp = angular.module('opiumApp', [
    'ngRoute',
    'opiumControllers',
    'opiumRestClient'
]);

function routeProvider($routeProvider) {
    $routeProvider
    .when('/:path*\/:photo.:extension', {
        templateUrl: 'views/photo.html',
        controller: 'PhotoCtrl'
    })
    .when('/', {
        templateUrl: 'views/album-list.html',
        controller: 'AlbumListCtrl'
    })
    .when('/:path*', {
        templateUrl: 'views/album-list.html',
        controller: 'AlbumListCtrl'
    })
    //.otherwise({
    //    redirectTo: '/'
    //})
}

function resourceProvider($resourceProvider) {
    $resourceProvider.defaults.stripTrailingSlashes = false;
    $resourceProvider.defaults.encodeSlashes = false;
}

opiumApp.config(['$routeProvider', routeProvider]);
opiumApp.config(['$resourceProvider', resourceProvider]);

