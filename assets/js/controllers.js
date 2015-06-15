'use strict';

var opiumControllers = angular.module('opiumControllers', []);

opiumControllers.controller('LoginCtrl', ['$scope', 'localStorageService', '$location', 'Restangular', function LoginCtrl($scope, localStorageService, $location, Restangular) {
  $scope.save = function () {
    var auth = 'Basic ' + btoa($scope.user.login + ':' + $scope.user.password);

    Restangular.setDefaultHeaders({
      Authorization: auth
    });
    localStorageService.set('Authorization', auth);

    $location.path('/');
  };
}]);

function AlbumGeoPoints(leafletBoundsHelpers) {
  this.getMapDefaultNoInteractions = function () {
    return {
      attributionControl: false,
      dragging: false,
      boxZoom: false,
      scrollWheelZoom: false,
      zoomControl: false,
      doubleClickZoom: false,
      touchZoom: false,
      tileLayer: 'http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png'
    };
  };

  this.getBoundsFromMarkers = function (markers) {
    if (!markers || markers.length == 0) {
      return null;
    }

    var neLat = undefined;
    var neLng = undefined;
    var swLat = undefined;
    var swLng = undefined;

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = markers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var marker = _step.value;

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
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator['return']) {
          _iterator['return']();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    var latDiff = (neLat - swLat) / 2;
    neLat = neLat + latDiff;
    swLat = swLat - latDiff;

    var lonDiff = (neLng - swLng) / 2;
    neLng = neLng + lonDiff;
    swLng = swLng - lonDiff;

    return leafletBoundsHelpers.createBoundsFromArray([[neLat, neLng], [swLat, swLng]]);
  };

  this.getMarkersFromPhotos = function (children, showMarker) {
    var markers = [];
    var i = undefined;
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = children[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var photo = _step2.value;

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
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2['return']) {
          _iterator2['return']();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    return markers;
  };
};

opiumApp.service('albumGeoPoints', ['leafletBoundsHelpers', AlbumGeoPoints]);

opiumControllers.controller('AlbumListCtrl', ['$scope', '$routeParams', 'Album', 'leafletEvents', '$location', '$anchorScroll', 'albumGeoPoints', function AlbumListCtrl($scope, $routeParams, Album, leafletEvents, $location, $anchorScroll, albumGeoPoints) {
  var path = $routeParams.path;
  var getter = Album.one(path).get({ gutter: 10 });

  // map
  $scope.markers = new Array();
  $scope.maxbounds = null;
  $scope.events = {
    markers: {
      enable: leafletEvents.getAvailableMarkerEvents()
    }
  };
  $scope.mapDefaults = albumGeoPoints.getMapDefaultNoInteractions();

  getter.then(function (data) {
    $scope.folder = data;

    $scope.markers = albumGeoPoints.getMarkersFromPhotos(data.children, false);
    $scope.maxbounds = albumGeoPoints.getBoundsFromMarkers($scope.markers);

    $scope.$on('leafletDirectiveMarker.click', function (event, args) {
      $scope.selected = args.model.slug;
      $scope.scrollTo(args.model.slug);
    });
  });

  $scope.scrollTo = function (slug) {
    $location.hash(slug);
    $anchorScroll();
    return false;
  };

  $scope.getHeaderStyle = function () {
    var cover = $scope.getCover();
    if (cover) {
      return { 'background-image': 'linear-gradient(to bottom, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, .8)), url(' + cover + ')' };
    }
  };

  $scope.getCover = function () {
    if ($scope.folder && $scope.folder._embedded.directory_thumbnail) {
      return $scope.folder._embedded.directory_thumbnail.thumbnails.banner;
    }
  };

  $scope.getAlbumById = function (itemId) {
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = $scope.folder.children[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var album = _step3.value;

        if (album.id == itemId) {
          return album;
        }
      }
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3['return']) {
          _iterator3['return']();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }
  };
}]);

opiumControllers.controller('AlbumMapCtrl', ['$scope', '$routeParams', 'Album', 'leafletEvents', 'albumGeoPoints', function AlbumMapCtrl($scope, $routeParams, Album, leafletEvents, albumGeoPoints) {
  var path = $routeParams.path;
  var getter = Album.one(path).get();

  getter.then(function (data) {
    $scope.folder = data;

    $scope.markers = albumGeoPoints.getMarkersFromPhotos(data.children, true);
    $scope.maxbounds = albumGeoPoints.getBoundsFromMarkers($scope.markers);

    $scope.$on('leafletDirectiveMarker.click', function (event, args) {
      $scope.selected = args.model.slug;
      $scope.scrollTo(args.model.slug);
    });
  });
}]);

opiumControllers.controller('PhotoCtrl', ['$scope', '$routeParams', 'Photo', 'Album', 'hotkeys', function PhotoCtrl($scope, $routeParams, Photo, Album, hotkeys) {
  var id = $routeParams.photo;

  Photo.one(id).get().then(function (data) {
    $scope.photo = data;
    $scope.centerMap();
  });

  $scope.photo = null;

  $scope.setCover = function () {
    $scope.uploading = true;
    var parent = Album.one($scope.photo.parent.slug).get().then(function (parent) {
      parent._embedded.directory_thumbnail = { id: $scope.photo.id };
      parent.save().then(function () {
        $scope.uploading = false;
      });
    });
  };

  $scope.savePosition = function () {
    $scope.overridingPosition = true;
    $scope.overridePosition = false;

    $scope.photo.save().then(function (data) {
      $scope.photo = data;
      $scope.centerMap();
      $scope.overridingPosition = false;
    });
  };

  $scope.previous = function () {
    if ($scope.photo.previous) {
      document.querySelector('.opium-photo-previous a').click();
    }
  };

  $scope.next = function () {
    if ($scope.photo.next) {
      document.querySelector('.opium-photo-next a').click();
    }
  };

  hotkeys.add({
    combo: 'right',
    callback: function callback() {
      $scope.next();
    }
  });
  hotkeys.add({
    combo: 'left',
    callback: function callback() {
      $scope.previous();
    }
  });

  $scope.centerMap = function () {
    if ($scope.photo.position) {
      $scope.mapCenter = {
        lat: $scope.photo.position.lat,
        lng: $scope.photo.position.lng,
        zoom: 10
      };

      $scope.markers = {
        photo: {
          lat: $scope.photo.position.lat,
          lng: $scope.photo.position.lng,
          message: $scope.photo.name
        }
      };
    }
  };

  $scope.hasExif = function () {
    return $scope.photo && (!Array.isArray($scope.photo.exif) || $scope.photo.exif.length > 0);
  };
}]);
//# sourceMappingURL=data:application/json;base64,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Q0FBQztLQUNmO0dBQ0YsQ0FBQyxDQUFDO0FBQ0gsU0FBTyxDQUFDLEdBQUcsQ0FBQztBQUNWLFNBQUssRUFBRSxNQUFNO0FBQ2IsWUFBUSxFQUFFLG9CQUFXO0FBQ25CLFlBQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQztLQUNuQjtHQUNGLENBQUMsQ0FBQzs7QUFFSCxRQUFNLENBQUMsU0FBUyxHQUFHLFlBQVc7QUFDNUIsUUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRTtBQUN6QixZQUFNLENBQUMsU0FBUyxHQUFHO0FBQ2pCLFdBQUcsRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHO0FBQzlCLFdBQUcsRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHO0FBQzlCLFlBQUksRUFBRSxFQUFFO09BQ1QsQ0FBQTs7QUFFRCxZQUFNLENBQUMsT0FBTyxHQUFHO0FBQ2YsYUFBSyxFQUFFO0FBQ0wsYUFBRyxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUc7QUFDOUIsYUFBRyxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUc7QUFDOUIsaUJBQU8sRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUk7U0FDM0I7T0FDRixDQUFDO0tBQ0g7R0FDRixDQUFBOztBQUVELFFBQU0sQ0FBQyxPQUFPLEdBQUcsWUFBVztBQUMxQixXQUFPLE1BQU0sQ0FBQyxLQUFLLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQSxBQUFDLENBQUM7R0FDNUYsQ0FBQTtDQUNGLENBRUYsQ0FBQyIsImZpbGUiOiJjb250cm9sbGVycy5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IG9waXVtQ29udHJvbGxlcnMgPSBhbmd1bGFyLm1vZHVsZSgnb3BpdW1Db250cm9sbGVycycsIFtdKTtcblxub3BpdW1Db250cm9sbGVycy5jb250cm9sbGVyKFxuICAnTG9naW5DdHJsJyxcbiAgZnVuY3Rpb24gTG9naW5DdHJsKCRzY29wZSwgbG9jYWxTdG9yYWdlU2VydmljZSwgJGxvY2F0aW9uLCBSZXN0YW5ndWxhcikge1xuICAgICRzY29wZS5zYXZlID0gZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgYXV0aCA9ICdCYXNpYyAnICsgYnRvYSgkc2NvcGUudXNlci5sb2dpbiArICc6JyArICRzY29wZS51c2VyLnBhc3N3b3JkKTtcblxuICAgICAgUmVzdGFuZ3VsYXIuc2V0RGVmYXVsdEhlYWRlcnMoe1xuICAgICAgICBBdXRob3JpemF0aW9uOiBhdXRoXG4gICAgICB9KTtcbiAgICAgIGxvY2FsU3RvcmFnZVNlcnZpY2Uuc2V0KCdBdXRob3JpemF0aW9uJywgYXV0aCk7XG5cbiAgICAgICRsb2NhdGlvbi5wYXRoKCcvJyk7XG4gICAgfVxuICB9XG5cbik7XG5cbmZ1bmN0aW9uIEFsYnVtR2VvUG9pbnRzKGxlYWZsZXRCb3VuZHNIZWxwZXJzKSB7XG4gIHRoaXMuZ2V0TWFwRGVmYXVsdE5vSW50ZXJhY3Rpb25zID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGF0dHJpYnV0aW9uQ29udHJvbDogZmFsc2UsXG4gICAgICBkcmFnZ2luZzogZmFsc2UsXG4gICAgICBib3hab29tOiBmYWxzZSxcbiAgICAgIHNjcm9sbFdoZWVsWm9vbTogZmFsc2UsXG4gICAgICB6b29tQ29udHJvbDogZmFsc2UsXG4gICAgICBkb3VibGVDbGlja1pvb206IGZhbHNlLFxuICAgICAgdG91Y2hab29tOiBmYWxzZSxcbiAgICAgIHRpbGVMYXllcjogJ2h0dHA6Ly97c30udGlsZXMud21mbGFicy5vcmcvYnctbWFwbmlrL3t6fS97eH0ve3l9LnBuZydcbiAgICB9O1xuICB9O1xuXG4gIHRoaXMuZ2V0Qm91bmRzRnJvbU1hcmtlcnMgPSBmdW5jdGlvbihtYXJrZXJzKSB7XG4gICAgaWYgKCFtYXJrZXJzIHx8IG1hcmtlcnMubGVuZ3RoID09IDApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGxldCBuZUxhdDtcbiAgICBsZXQgbmVMbmc7XG4gICAgbGV0IHN3TGF0O1xuICAgIGxldCBzd0xuZztcblxuICAgIGZvciAobGV0IG1hcmtlciBvZiAgbWFya2Vycykge1xuICAgICAgLy8gbGF0aXR1ZGVcbiAgICAgIGlmIChuZUxhdCA9PT0gdW5kZWZpbmVkIHx8IG5lTGF0IDwgbWFya2VyLmxhdCkge1xuICAgICAgICBuZUxhdCA9IG1hcmtlci5sYXQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChzd0xhdCA9PT0gdW5kZWZpbmVkIHx8IHN3TGF0ID4gbWFya2VyLmxhdCkge1xuICAgICAgICBzd0xhdCA9IG1hcmtlci5sYXQ7XG4gICAgICB9XG5cbiAgICAgIC8vIGxvbmdpdHVkZVxuICAgICAgaWYgKG5lTG5nID09PSB1bmRlZmluZWQgfHwgbmVMbmcgPCBtYXJrZXIubG5nKSB7XG4gICAgICAgIG5lTG5nID0gbWFya2VyLmxuZztcbiAgICAgIH1cblxuICAgICAgaWYgKHN3TG5nID09PSB1bmRlZmluZWQgfHwgc3dMbmcgPiBtYXJrZXIubG5nKSB7XG4gICAgICAgIHN3TG5nID0gbWFya2VyLmxuZztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgbGF0RGlmZiA9IChuZUxhdCAtIHN3TGF0KSAvIDI7XG4gICAgbmVMYXQgPSBuZUxhdCArIGxhdERpZmY7XG4gICAgc3dMYXQgPSBzd0xhdCAtIGxhdERpZmY7XG5cbiAgICBsZXQgbG9uRGlmZiA9IChuZUxuZyAtIHN3TG5nKSAvIDI7XG4gICAgbmVMbmcgPSBuZUxuZyArIGxvbkRpZmY7XG4gICAgc3dMbmcgPSBzd0xuZyAtIGxvbkRpZmY7XG5cbiAgICByZXR1cm4gbGVhZmxldEJvdW5kc0hlbHBlcnMuY3JlYXRlQm91bmRzRnJvbUFycmF5KFtcbiAgICAgICAgW25lTGF0LCBuZUxuZ10sXG4gICAgICAgIFtzd0xhdCwgc3dMbmddXG4gICAgXSk7XG4gIH07XG5cbiAgdGhpcy5nZXRNYXJrZXJzRnJvbVBob3RvcyA9IGZ1bmN0aW9uKGNoaWxkcmVuLCBzaG93TWFya2VyKSB7XG4gICAgbGV0IG1hcmtlcnMgPSBbXTtcbiAgICBsZXQgaTtcbiAgICBmb3IgKGxldCBwaG90byBvZiBjaGlsZHJlbikge1xuICAgICAgaWYgKHBob3RvICYmIHBob3RvLnBvc2l0aW9uKSB7XG4gICAgICAgIGxldCBtYXJrZXIgPSB7XG4gICAgICAgICAgbGF0OiBwaG90by5wb3NpdGlvbi5sYXQsXG4gICAgICAgICAgbG5nOiBwaG90by5wb3NpdGlvbi5sbmdcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoc2hvd01hcmtlcikge1xuICAgICAgICAgIG1hcmtlci5tZXNzYWdlID0gcGhvdG8ubmFtZTtcbiAgICAgICAgICBtYXJrZXIuc2x1ZyA9IHBob3RvLnNsdWc7XG4gICAgICAgIH1cblxuICAgICAgICBtYXJrZXJzLnB1c2gobWFya2VyKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbWFya2VycztcbiAgfVxufTtcblxub3BpdW1BcHAuc2VydmljZSgnYWxidW1HZW9Qb2ludHMnLCBbJ2xlYWZsZXRCb3VuZHNIZWxwZXJzJywgQWxidW1HZW9Qb2ludHNdKTtcblxub3BpdW1Db250cm9sbGVycy5jb250cm9sbGVyKFxuICAnQWxidW1MaXN0Q3RybCcsXG4gIGZ1bmN0aW9uIEFsYnVtTGlzdEN0cmwoJHNjb3BlLCAkcm91dGVQYXJhbXMsIEFsYnVtLCBsZWFmbGV0RXZlbnRzLCAkbG9jYXRpb24sICRhbmNob3JTY3JvbGwsIGFsYnVtR2VvUG9pbnRzKSB7XG4gICAgbGV0IHBhdGggPSAkcm91dGVQYXJhbXMucGF0aDtcbiAgICBsZXQgZ2V0dGVyID0gQWxidW0ub25lKHBhdGgpLmdldCh7Z3V0dGVyOiAxMH0pO1xuXG4gICAgLy8gbWFwXG4gICAgJHNjb3BlLm1hcmtlcnMgPSBuZXcgQXJyYXkoKTtcbiAgICAkc2NvcGUubWF4Ym91bmRzID0gbnVsbDtcbiAgICAkc2NvcGUuZXZlbnRzID0ge1xuICAgICAgbWFya2Vyczoge1xuICAgICAgICBlbmFibGU6IGxlYWZsZXRFdmVudHMuZ2V0QXZhaWxhYmxlTWFya2VyRXZlbnRzKClcbiAgICAgIH1cbiAgICB9O1xuICAgICRzY29wZS5tYXBEZWZhdWx0cyA9IGFsYnVtR2VvUG9pbnRzLmdldE1hcERlZmF1bHROb0ludGVyYWN0aW9ucygpO1xuXG4gICAgZ2V0dGVyLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICRzY29wZS5mb2xkZXIgPSBkYXRhO1xuXG4gICAgICAkc2NvcGUubWFya2VycyA9IGFsYnVtR2VvUG9pbnRzLmdldE1hcmtlcnNGcm9tUGhvdG9zKGRhdGEuY2hpbGRyZW4sIGZhbHNlKTtcbiAgICAgICRzY29wZS5tYXhib3VuZHMgPSBhbGJ1bUdlb1BvaW50cy5nZXRCb3VuZHNGcm9tTWFya2Vycygkc2NvcGUubWFya2Vycyk7XG5cbiAgICAgICRzY29wZS4kb24oJ2xlYWZsZXREaXJlY3RpdmVNYXJrZXIuY2xpY2snLCAoZXZlbnQsIGFyZ3MpID0+IHtcbiAgICAgICAgJHNjb3BlLnNlbGVjdGVkID0gYXJncy5tb2RlbC5zbHVnO1xuICAgICAgICAkc2NvcGUuc2Nyb2xsVG8oYXJncy5tb2RlbC5zbHVnKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgJHNjb3BlLnNjcm9sbFRvID0gZnVuY3Rpb24oc2x1Zykge1xuICAgICAgJGxvY2F0aW9uLmhhc2goc2x1Zyk7XG4gICAgICAkYW5jaG9yU2Nyb2xsKCk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcblxuICAgICRzY29wZS5nZXRIZWFkZXJTdHlsZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgbGV0IGNvdmVyID0gJHNjb3BlLmdldENvdmVyKCk7XG4gICAgICBpZiAoY292ZXIpIHtcbiAgICAgICAgcmV0dXJuIHsnYmFja2dyb3VuZC1pbWFnZSc6IGBsaW5lYXItZ3JhZGllbnQodG8gYm90dG9tLCByZ2JhKDAsIDAsIDAsIDApIDUwJSwgcmdiYSgwLCAwLCAwLCAuOCkpLCB1cmwoJHtjb3Zlcn0pYH07XG4gICAgICB9XG4gICAgfTtcblxuICAgICRzY29wZS5nZXRDb3ZlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKCRzY29wZS5mb2xkZXIgJiYgJHNjb3BlLmZvbGRlci5fZW1iZWRkZWQuZGlyZWN0b3J5X3RodW1ibmFpbCkge1xuICAgICAgICByZXR1cm4gJHNjb3BlLmZvbGRlci5fZW1iZWRkZWQuZGlyZWN0b3J5X3RodW1ibmFpbC50aHVtYm5haWxzLmJhbm5lcjtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgJHNjb3BlLmdldEFsYnVtQnlJZCA9IGZ1bmN0aW9uKGl0ZW1JZCkge1xuICAgICAgZm9yIChsZXQgYWxidW0gb2YgJHNjb3BlLmZvbGRlci5jaGlsZHJlbikge1xuICAgICAgICBpZiAoYWxidW0uaWQgPT0gaXRlbUlkKSB7XG4gICAgICAgICAgcmV0dXJuIGFsYnVtO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4pO1xuXG5vcGl1bUNvbnRyb2xsZXJzLmNvbnRyb2xsZXIoXG4gICdBbGJ1bU1hcEN0cmwnLFxuICBmdW5jdGlvbiBBbGJ1bU1hcEN0cmwoJHNjb3BlLCAkcm91dGVQYXJhbXMsIEFsYnVtLCBsZWFmbGV0RXZlbnRzLCBhbGJ1bUdlb1BvaW50cykge1xuICAgIGxldCBwYXRoID0gJHJvdXRlUGFyYW1zLnBhdGg7XG4gICAgbGV0IGdldHRlciA9IEFsYnVtLm9uZShwYXRoKS5nZXQoKTtcblxuICAgIGdldHRlci50aGVuKChkYXRhKSA9PiB7XG4gICAgICAkc2NvcGUuZm9sZGVyID0gZGF0YTtcblxuICAgICAgJHNjb3BlLm1hcmtlcnMgPSBhbGJ1bUdlb1BvaW50cy5nZXRNYXJrZXJzRnJvbVBob3RvcyhkYXRhLmNoaWxkcmVuLCB0cnVlKTtcbiAgICAgICRzY29wZS5tYXhib3VuZHMgPSBhbGJ1bUdlb1BvaW50cy5nZXRCb3VuZHNGcm9tTWFya2Vycygkc2NvcGUubWFya2Vycyk7XG5cbiAgICAgICRzY29wZS4kb24oJ2xlYWZsZXREaXJlY3RpdmVNYXJrZXIuY2xpY2snLCAoZXZlbnQsIGFyZ3MpID0+IHtcbiAgICAgICAgJHNjb3BlLnNlbGVjdGVkID0gYXJncy5tb2RlbC5zbHVnO1xuICAgICAgICAkc2NvcGUuc2Nyb2xsVG8oYXJncy5tb2RlbC5zbHVnKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbilcblxub3BpdW1Db250cm9sbGVycy5jb250cm9sbGVyKFxuICAnUGhvdG9DdHJsJyxcbiAgZnVuY3Rpb24gUGhvdG9DdHJsKCRzY29wZSwgJHJvdXRlUGFyYW1zLCBQaG90bywgQWxidW0sIGhvdGtleXMpIHtcbiAgICBsZXQgaWQgPSAkcm91dGVQYXJhbXMucGhvdG87XG5cbiAgICBQaG90by5vbmUoaWQpLmdldCgpXG4gICAgLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICRzY29wZS5waG90byA9IGRhdGE7XG4gICAgICAkc2NvcGUuY2VudGVyTWFwKCk7XG4gICAgfSk7XG5cbiAgICAkc2NvcGUucGhvdG8gPSBudWxsO1xuXG4gICAgJHNjb3BlLnNldENvdmVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAkc2NvcGUudXBsb2FkaW5nID0gdHJ1ZTtcbiAgICAgIGxldCBwYXJlbnQgPSBBbGJ1bS5vbmUoJHNjb3BlLnBob3RvLnBhcmVudC5zbHVnKVxuICAgICAgLmdldCgpXG4gICAgICAudGhlbigocGFyZW50KSA9PiB7XG4gICAgICAgIHBhcmVudC5fZW1iZWRkZWQuZGlyZWN0b3J5X3RodW1ibmFpbCA9IHsgaWQ6ICRzY29wZS5waG90by5pZCB9O1xuICAgICAgICBwYXJlbnQuc2F2ZSgpXG4gICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAkc2NvcGUudXBsb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICAgICAgIClcbiAgICB9O1xuXG4gICAgJHNjb3BlLnNhdmVQb3NpdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgJHNjb3BlLm92ZXJyaWRpbmdQb3NpdGlvbiA9IHRydWU7XG4gICAgICAkc2NvcGUub3ZlcnJpZGVQb3NpdGlvbiA9IGZhbHNlO1xuXG4gICAgICAkc2NvcGUucGhvdG8uc2F2ZSgpXG4gICAgICAudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICAkc2NvcGUucGhvdG8gPSBkYXRhO1xuICAgICAgICAkc2NvcGUuY2VudGVyTWFwKCk7XG4gICAgICAgICRzY29wZS5vdmVycmlkaW5nUG9zaXRpb24gPSBmYWxzZTtcbiAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgJHNjb3BlLnByZXZpb3VzID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoJHNjb3BlLnBob3RvLnByZXZpb3VzKSB7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5vcGl1bS1waG90by1wcmV2aW91cyBhJykuY2xpY2soKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgJHNjb3BlLm5leHQgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmICgkc2NvcGUucGhvdG8ubmV4dCkge1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcub3BpdW0tcGhvdG8tbmV4dCBhJykuY2xpY2soKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgaG90a2V5cy5hZGQoe1xuICAgICAgY29tYm86ICdyaWdodCcsXG4gICAgICBjYWxsYmFjazogZnVuY3Rpb24oKSB7XG4gICAgICAgICRzY29wZS5uZXh0KCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaG90a2V5cy5hZGQoe1xuICAgICAgY29tYm86ICdsZWZ0JyxcbiAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbigpIHtcbiAgICAgICAgJHNjb3BlLnByZXZpb3VzKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAkc2NvcGUuY2VudGVyTWFwID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoJHNjb3BlLnBob3RvLnBvc2l0aW9uKSB7XG4gICAgICAgICRzY29wZS5tYXBDZW50ZXIgPSB7XG4gICAgICAgICAgbGF0OiAkc2NvcGUucGhvdG8ucG9zaXRpb24ubGF0LFxuICAgICAgICAgIGxuZzogJHNjb3BlLnBob3RvLnBvc2l0aW9uLmxuZyxcbiAgICAgICAgICB6b29tOiAxMFxuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLm1hcmtlcnMgPSB7XG4gICAgICAgICAgcGhvdG86IHtcbiAgICAgICAgICAgIGxhdDogJHNjb3BlLnBob3RvLnBvc2l0aW9uLmxhdCxcbiAgICAgICAgICAgIGxuZzogJHNjb3BlLnBob3RvLnBvc2l0aW9uLmxuZyxcbiAgICAgICAgICAgIG1lc3NhZ2U6ICRzY29wZS5waG90by5uYW1lXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cblxuICAgICRzY29wZS5oYXNFeGlmID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gJHNjb3BlLnBob3RvICYmICghQXJyYXkuaXNBcnJheSgkc2NvcGUucGhvdG8uZXhpZikgfHwgJHNjb3BlLnBob3RvLmV4aWYubGVuZ3RoID4gMCk7XG4gICAgfVxuICB9XG5cbik7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=