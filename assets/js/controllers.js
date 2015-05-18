var opiumControllers = angular.module('opiumControllers', []);



opiumControllers.controller(
    'AlbumListCtrl',
    [
        '$scope', '$routeParams', 'Album', 'RootAlbum', 'leafletBoundsHelpers', 'leafletEvents', '$location', '$anchorScroll',
        function AlbumListCtrl($scope, $routeParams, Album, RootAlbum, leafletBoundsHelpers, leafletEvents, $location, $anchorScroll) {
            var path = $routeParams.path;
            if (path) {
                $scope.folder = Album.get({id: path});
            } else {
                $scope.folder = RootAlbum.get();
            }


            // map
            $scope.markers = new Array();
            $scope.events = {
                markers: {
                    enable: leafletEvents.getAvailableMarkerEvents()
                }
            };
            $scope.mapDefault = {
                scrollWheelZoom: false
            };

            $scope.folder.$promise.then(function(data) {
                var bounds = [];
                for(i in data.children) {
                    var photo = data.children[i];
                    if (photo && photo.position) {
                        $scope.markers.push({
                            lat: photo.position.lat,
                            lng: photo.position.lng,
                            message: photo.name,
                            slug: photo.slug
                        });
                        bounds.push([
                            photo.position.lat,
                            photo.position.lng
                        ]);
                    }
                }

                $scope.maxbounds = $scope.getBoundsFromMarkers($scope.markers);

                $scope.$on('leafletDirectiveMarker.click', function(event, args) {
                    $scope.selected = args.model.slug;
                    $scope.scrollTo(args.model.slug);
                });
            });

            $scope.scrollTo = function(slug) {
                $location.hash(slug);
                $anchorScroll();
                return false;
            };

            $scope.getBoundsFromMarkers = function(markers) {
                var neLat;
                var neLng;
                var swLat;
                var swLng;
                var markers;

                for (i in markers) {
                    marker = markers[i];

                    // latitude
                    if (neLat === undefined || neLat < marker.lat) {
                        neLat = marker.lat;
                    }
                    if (swLat === undefined || swLat > marker.lat) {
                        swLat = marker.lat;
                    }

                    // longitude
                    if (neLng === undefined || neLng < marker.lng) {
                        neLng = marker.lng;
                    }
                    if (swLng === undefined || swLng > marker.lng) {
                        swLng = marker.lng;
                    }
                }

                return leafletBoundsHelpers.createBoundsFromArray([
                    [neLat, neLng],
                    [swLat, swLng]
                ]);
            };
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


            $scope.photo.$promise.then(function(data) {
                if ($scope.photo.position) {
                    $scope.mapCenter = {
                        lat: $scope.photo.position.lat,
                        lng: $scope.photo.position.lng,
                        zoom: 10
                    }

                    $scope.markers = {
                        photo: {
                            lat: $scope.photo.position.lat,
                            lng: $scope.photo.position.lng,
                            message: $scope.photo.name
                        }
                    };
                }
            });


            $scope.hasExif = function() {
                return !Array.isArray($scope.photo.exif) || $scope.photo.exif.length > 0;
            }
        }
    ]
);
