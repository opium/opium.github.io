const API_URL = 'http://api.opium.sitioweb.fr/app.php';

//opium.get('list').done(function (data) { console.log(data.files) });
//

var opiumRestClient = angular.module('opiumRestClient', ['restangular']);

// config and redirect on login on error
opiumRestClient.run(['Restangular', '$location', 'localStorageService', function(Restangular, $location, localStorageService) {
  Restangular.setBaseUrl(API_URL + '/v1');

  var auth = localStorageService.get('Authorization');

  Restangular.setDefaultHeaders({
    Authorization: auth
  });

  Restangular.setErrorInterceptor(function(response, deferred, responseHandler) {
    if (response.status === 401) {
      $location.path('/login');
    }
  });
}]);

opiumRestClient.factory(
    'Album',
    [
        'Restangular',
        function(Restangular) {
          return Restangular.service('directories');
        }

    ]
);

opiumRestClient.factory(
    'Photo',
    [
        'Restangular',
        function(Restangular) {
          return Restangular.service('files');
        }

    ]
);
