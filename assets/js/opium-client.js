//opium = new Amygdala({
//  'config': {
//    'apiUrl': 'http://opium.sitioweb.fr/app_dev.php/v1/json',
//    'idAttribute': 'url',
//    'headers': {
//      //'X-CSRFToken': getCookie('csrftoken')
//    },
//    'localStorage': true
//  },
//  'schema': {
//    'list': {
//      'url': '/'
//    }
//  }
//});

//opium.get('list').done(function (data) { console.log(data.files) });
//

var opiumRestClient = angular.module('opiumRestClient', ['ngResource']);

opiumRestClient.factory(
    'RootAlbum',
    [
        '$resource',
        function($resource) {
            return $resource('/app_dev.php/v1/directories', {}, {});
        }
    ]
);

opiumRestClient.factory(
    'Album',
    [
        '$resource',
        function($resource) {
            return $resource('/app_dev.php/v1/directories/:id', {id: '@current.id'}, {});
        }
    ]
);

opiumRestClient.factory(
    'Photo',
    [
        '$resource',
        function($resource) {
            return $resource('/app_dev.php/v1/files/:path', {path: '@current.pathname'}, {});
        }
    ]
);
