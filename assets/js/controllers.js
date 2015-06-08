var opiumControllers = angular.module('opiumControllers', []);

opiumControllers.controller(
    'LoginCtrl',
    [
        '$scope', 'localStorageService', '$location', 'Restangular',
        function LoginCtrl($scope, localStorageService, $location, Restangular) {
          $scope.save = function() {
            var auth = 'Basic ' + btoa($scope.user.login + ':' + $scope.user.password);

            Restangular.setDefaultHeaders({
              Authorization: auth
            });
            localStorageService.set('Authorization', auth);

            $location.path('/');
          }
        }

    ]
);

function AlbumGeoPoints(leafletBoundsHelpers) {
  this.getMapDefaultNoInteractions = function() {
    return {
      attributionControl: false,
      dragging: false,
      boxZoom: false,
      scrollWheelZoom: false,
      zoomControl: false,
      doubleClickZoom: false,
      touchZoom: false
    };
  };

  this.getBoundsFromMarkers = function(markers) {
    if (!markers || markers.length == 0) {
      return null;
    }

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

    var latDiff = (neLat - swLat) / 2;
    neLat = neLat + latDiff;
    swLat = swLat - latDiff;

    var lonDiff = (neLng - swLng) / 2;
    neLng = neLng + lonDiff;
    swLng = swLng - lonDiff;

    return leafletBoundsHelpers.createBoundsFromArray([
        [neLat, neLng],
        [swLat, swLng]
    ]);
  };

  this.getMarkersFromPhotos = function(children, showMarker) {
    var markers = [];
    for (i in children) {
      var photo = children[i];
      if (photo && photo.position) {
        var marker = {
          lat: photo.position.lat,
          lng: photo.position.lng
        };

        if (showMarker) {
          marker.message = photo.name;
          marker.slug = photo.slug;
        }

        markers.push(marker);
      }
    }

    return markers;
  }
};

opiumApp.service('albumGeoPoints', ['leafletBoundsHelpers', AlbumGeoPoints]);

opiumControllers.controller(
    'AlbumListCtrl',
    [
        '$scope', '$routeParams', 'Album', 'leafletEvents', '$location', '$anchorScroll', 'albumGeoPoints',
        function AlbumListCtrl($scope, $routeParams, Album, leafletEvents, $location, $anchorScroll, albumGeoPoints) {
          var path = $routeParams.path;
          var getter = Album.one(path).get();

          // map
          $scope.markers = new Array();
          $scope.maxbounds = null;
          $scope.events = {
            markers: {
              enable: leafletEvents.getAvailableMarkerEvents()
            }
          };
          $scope.mapDefaults = albumGeoPoints.getMapDefaultNoInteractions();

          getter.then(function(data) {
            $scope.folder = data;

            $scope.markers = albumGeoPoints.getMarkersFromPhotos(data.children, false);
            $scope.maxbounds = albumGeoPoints.getBoundsFromMarkers($scope.markers);

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
        }

    ]
);

opiumControllers.controller(
    'AlbumMapCtrl',
    [
        '$scope', '$routeParams', 'Album', 'leafletEvents', 'albumGeoPoints',
        function AlbumMapCtrl($scope, $routeParams, Album, leafletEvents, albumGeoPoints) {
          var path = $routeParams.path;
          var getter = Album.one(path).get();

          getter.then(function(data) {
            $scope.folder = data;

            $scope.markers = albumGeoPoints.getMarkersFromPhotos(data.children, true);
            $scope.maxbounds = albumGeoPoints.getBoundsFromMarkers($scope.markers);

            $scope.$on('leafletDirectiveMarker.click', function(event, args) {
              $scope.selected = args.model.slug;
              $scope.scrollTo(args.model.slug);
            });
          });
        }

    ]
)

opiumControllers.controller(
    'PhotoCtrl',
    [
        '$scope', '$routeParams', 'Photo', 'Album', 'hotkeys',
        function PhotoCtrl($scope, $routeParams, Photo, Album, hotkeys) {
          var id = $routeParams.photo;
          Photo.one(id).get()
              .then(function(data) {
                $scope.photo = data;
                $scope.centerMap();
              });

          $scope.photo = null;

          $scope.setCover = function() {
            $scope.uploading = true;
            var parent = Album.one($scope.photo.parent.slug)
            .get()
                .then(function(parent) {
                  parent._embedded.directory_thumbnail = { id: $scope.photo.id };
                  parent.save()
                  .then(function() {
                    $scope.uploading = false;
                  });
                }

            )
          };

          $scope.savePosition = function() {
              $scope.overridingPosition = true;
              $scope.overridePosition = false;
              $scope.photo.save()
                  .then(function(data) {
                      $scope.photo = data;
                      $scope.centerMap();
                      $scope.overridingPosition = false;
                  });

          }

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

          $scope.centerMap = function() {
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
          }

          $scope.hasExif = function() {
            return $scope.photo && (!Array.isArray($scope.photo.exif) || $scope.photo.exif.length > 0);
          }
        }

    ]
);
