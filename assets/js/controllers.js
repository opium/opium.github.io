var opiumControllers = angular.module('opiumControllers', []);

function AlbumListCtrl($scope, $http, $routeParams) {
    console.log($routeParams);
    var url = '/app_dev.php/v1/json/' + ($routeParams.path ? $routeParams.path : '');
    $http.get(url).success(function(data) {
        $scope.albumList = data.files;
        $scope.parentDirectory = data.parentDirectory;

        $('.container').magnificPopup({
            delegate: '.popup-image',
            type: 'image',
            gallery: {
                enabled: true
            }
        });
    });
}

opiumControllers.controller('AlbumListCtrl', ['$scope', '$http', '$routeParams', AlbumListCtrl]);
