const APP_FILE = '/app.php';

//opium.get('list').done(function (data) { console.log(data.files) });
//

var opiumRestClient = angular.module('opiumRestClient', ['ngResource']);

opiumRestClient.factory(
    'RootAlbum',
    [
        '$resource',
        function($resource) {
            return $resource(APP_FILE + '/v1/directories', {}, {});
        }
    ]
);

opiumRestClient.factory(
    'Album',
    [
        '$resource',
        function($resource) {
            return $resource(APP_FILE + '/v1/directories/:id', {id: '@id'},
                {
                    update: { method: 'PUT' }
                }
            );
        }
    ]
);

opiumRestClient.factory(
    'Photo',
    [
        '$resource',
        function($resource) {
            return $resource(APP_FILE + '/v1/files/:id', {id: '@id'}, {});
        }
    ]
);
