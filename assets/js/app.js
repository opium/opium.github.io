var opiumApp = angular.module('opiumApp', [
    'ngRoute',
    'opiumControllers'
]);

function routeProvider($routeProvider) {
    $routeProvider
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

opiumApp.config(['$routeProvider',routeProvider]);

