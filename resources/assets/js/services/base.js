import axios from 'axios';
import config from '../config';

class BaseService {
    constructor(urlPrefix) {
        let server = axios.create();
        server.interceptors.response.use((response) => {
            // process response from server here if need be?

            return Promise.resolve(response.data);
        }, (error) => {
            return Promise.reject(error);
        });
        // server.defaults.headers.common['Accept'] = 'application/json';

        this.server = server;
        this.baseUrl = [config.apiUrl, urlPrefix].join('/');
    }

    all() {
        return this.server.get(this.baseUrl);
    }

    get(id) {
        return this.server.get([this.baseUrl, id].join('/'));
    }

    save(item) {
        if (item.id) {
            return this.server.put([this.baseUrl, item.id].join('/'), item);
        }

        return this.server.post(this.baseUrl, item);
    }

    delete(item) {
        if (+item !== item) {
            item = item.id;
        }

        return this.server.delete([this.baseUrl, item].join('/'));
    }
}

export default BaseService;
