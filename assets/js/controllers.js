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
        }
    ]
);

opiumControllers.controller(
    'PhotoCtrl',
    [
        '$scope', '$routeParams', 'Photo', 'Album', 'hotkeys',
        function PhotoCtrl($scope, $routeParams, Photo, Album, hotkeys) {
            var id = $routeParams.photo;

            $scope.photo = Photo.get({ id: id });

            $scope.setCover = function() {
                var parent = $scope.photo.parent;
                parent._embedded.directory_thumbnail = { id: $scope.photo.id };
                Album.update(parent);
            };

            $scope.previous = function() {
                if ($scope.photo.previous) {
                    document.querySelector('.opium-photo-previous a').click();
                }
            };

            $scope.next = function() {
                if ($scope.photo.next) {
                    document.querySelector('.opium-photo-next a').click();
                }
            };

            hotkeys.add({
                combo: 'right',
                callback: function() {
                    $scope.next();
                }
            });
            hotkeys.add({
                combo: 'left',
                callback: function() {
                    $scope.previous();
                }
            });
        }
    ]
);
