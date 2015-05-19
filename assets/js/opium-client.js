const API_URL = 'http://api.opium.sitioweb.fr/app.php';

//opium.get('list').done(function (data) { console.log(data.files) });
//

var opiumRestClient = angular.module('opiumRestClient', ['restangular']);

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
