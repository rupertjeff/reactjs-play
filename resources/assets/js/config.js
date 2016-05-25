let apiUrl = [
    window.baseUrl,
    'api'
].map(function (value) {
    return value
        .replace(/^\/+/, '')
        .replace(/\/+$/, '');
}).join('/');

window.axios.defaults.headers.common['Accept'] = 'application/json';
