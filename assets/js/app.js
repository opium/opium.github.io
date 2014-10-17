var opiumApp = angular.module('opiumApp', [
    'ngRoute',
    'opiumControllers'
]);

function routeProvider($routeProvider) {
    $routeProvider
    .when('/:path?', {
        templateUrl: 'views/album-list.html',
        controller: 'AlbumListCtrl'
    })
    //.otherwise({
    //    redirectTo: '/'
    //})
}

opiumApp.config(['$routeProvider',routeProvider]);

