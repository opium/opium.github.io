const opiumRestClient = angular.module('opiumRestClient', ['restangular']);

// config and redirect on login on error
opiumRestClient.run(function(Restangular, $location, localStorageService) {
  Restangular.setBaseUrl(API_URL + '/v1');

  let auth = localStorageService.get('Authorization');

  Restangular.setDefaultHeaders({
    Authorization: auth,
    'X-Device-Width': window.innerWidth,
    'X-Device-Height': window.innerHeight,
  });

  Restangular.setErrorInterceptor((response, deferred, responseHandler) => {
    if (response.status === 401) {
      $location.path('/login');
    }
  });
});

opiumRestClient.factory(
  'Album',
  function(Restangular) {
    return Restangular.service('directories');
  }

);

opiumRestClient.factory(
  'Photo',
  function(Restangular) {
    return Restangular.service('files');
  }

);
