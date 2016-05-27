import axios from 'axios';
import config from '../config';

class TaskService {
    constructor() {
        let server = axios.create();
        server.interceptors.response.use((response) => {
            // process response from server here if need be?

            return Promise.resolve(response.data);
        }, (error) => {
            return Promise.reject(error);
        });

        this.server = server;
        this.baseUrl = [config.apiUrl, 'tasks'].join('/');
    }

    all() {
        return this.server.get(this.baseUrl);
    }

    get(id) {
        return this.server.get([this.baseUrl, id].join('/'));
    }

    save(task) {
        if (task.id) {
            return this.server.put([this.baseUrl, task.id].join('/'), task);
        }

        return this.server.post(this.baseUrl, task);
    }

    delete(task) {
        if (+task !== task) {
            task = task.id;
        }

        return this.server.delete([this.baseUrl, task].join('/'));
    }

    sort(orderedTasks) {
        return this.server.patch([this.baseUrl, 'sort'].join('/'), orderedTasks);
    }
}

export default TaskService;
