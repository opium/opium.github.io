opium = new Amygdala({
  'config': {
    'apiUrl': 'http://opium.sitioweb.fr/app_dev.php/v1/json',
    'idAttribute': 'url',
    'headers': {
      //'X-CSRFToken': getCookie('csrftoken')
    },
    'localStorage': true
  },
  'schema': {
    'list': {
      'url': '/'
    }
  }
});

opium.get('list').done(function (data) { console.log(data.files) });
