var opiumControllers = angular.module('opiumControllers', []);

function AlbumListCtrl($scope, $http, $routeParams) {
    var url = '/app_dev.php/v1/json/' + ($routeParams.path ? $routeParams.path : '');
    $http.get(url).success(function(data) {
        $scope.albumList = data.files;
    });
}

opiumControllers.controller('AlbumListCtrl', ['$scope', '$http', '$routeParams', AlbumListCtrl]);
