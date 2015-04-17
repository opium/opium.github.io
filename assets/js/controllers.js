var opiumControllers = angular.module('opiumControllers', []);



opiumControllers.controller(
    'AlbumListCtrl',
    [
        '$scope', '$routeParams', 'Album', 'RootAlbum',
        function AlbumListCtrl($scope, $routeParams, Album, RootAlbum) {
            var path = $routeParams.path;
            if (path) {
                $scope.folder = Album.get({id: path});
            } else {
                $scope.folder = RootAlbum.get();
            }

            $scope.setCover = function(photo) {
                $scope.folder._embedded.directory_thumbnail = photo;
                $scope.folder.$update()
            };
        }
    ]
);

opiumControllers.controller(
    'PhotoCtrl',
    [
        '$scope', '$routeParams', 'Photo', 'Album',
        function PhotoCtrl($scope, $routeParams, Photo, Album) {
            var id = $routeParams.photo;

            $scope.photo = Photo.get({ id: id });

            $scope.setCover = function() {
                var parent = $scope.photo.parent;
                parent._embedded.directory_thumbnail = { id: $scope.photo.id };
                Album.update(parent);
            };
        }
    ]
);
