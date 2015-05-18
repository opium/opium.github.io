var opiumApp = angular.module('opiumApp', [
    'ngRoute',
    'opiumControllers',
    'opiumRestClient',
    'ngTouch',
    'cfp.hotkeys',
    'leaflet-directive'
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

//function resourceProvider($resourceProvider) {
    //$resourceProvider.defaults.stripTrailingSlashes = false;
    //$resourceProvider.defaults.encodeSlashes = false;
//}

opiumApp.config(['$routeProvider', '$locationProvider', routeProvider]);
//opiumApp.config(['$resourceProvider', resourceProvider]);

