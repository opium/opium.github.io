var opiumApp = angular.module('opiumApp', [
    'ngRoute',
    'opiumControllers',
    'opiumRestClient',
    'ngTouch',
    'cfp.hotkeys',
    'leaflet-directive'
]);

function routeProvider($routeProvider) {
    // $locationProvider.html5Mode(true);

    $routeProvider
    .when('/:path\/:photo', {
        templateUrl: 'views/photo.html',
        controller: 'PhotoCtrl'
    })
    .when('/', {
        templateUrl: 'views/album-list.html',
        controller: 'AlbumListCtrl'
    })
    .when('/:path', {
        templateUrl: 'views/album-list.html',
        controller: 'AlbumListCtrl'
    })
    //.otherwise({
    //    redirectTo: '/'
    //})
}

//function resourceProvider($resourceProvider) {
    //$resourceProvider.defaults.stripTrailingSlashes = false;
    //$resourceProvider.defaults.encodeSlashes = false;
//}

opiumApp.config(['$routeProvider', routeProvider]);
//opiumApp.config(['$resourceProvider', resourceProvider]);

