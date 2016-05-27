export default {
    apiUrl: [
        window.baseUrl,
        'api'
    ].map(function (value) {
        return value
            .replace(/^\/+/, '')
            .replace(/\/+$/, '');
    }).join('/')
};
