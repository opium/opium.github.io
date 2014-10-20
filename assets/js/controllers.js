var opiumControllers = angular.module('opiumControllers', []);



opiumControllers.controller(
    'AlbumListCtrl',
    [
        '$scope', '$routeParams', 'Album',
        function AlbumListCtrl($scope, $routeParams, Album) {
            // TODO fix for this https://github.com/angular/angular.js/pull/7940
            var path = $routeParams.path;
            if (path) {
                path = path.replace(/\//g, '_slash_');
            }
            $scope.folder = Album.get({path: path}, function() {
                $('.container').magnificPopup({
                    delegate: '.popup-image',
                    type: 'image',
                    gallery: {
                        enabled: true
                    },
                    image: {
                        titleSrc: function (item) {
                            return item.el.text().trim();
                        }
                    }
                });
            });

            $scope.setPhoto = function(photo) {
                $scope.folder.current.photo = photo;
                $scope.folder.$save();
            }
        }
    ]
);
