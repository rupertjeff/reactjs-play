import BaseService from './base';
import isString from './../helpers/isString';

class TaskService extends BaseService {
    constructor() {
        super('tasks');

        this.server.interceptors.request.use((config) => {
            let data = config.data;

            if (!data) {
                return config;
            }

            if (isString(data)) {
                data = JSON.parse(data);
            }

            if (data.tasklistId) {
                data.tasklist_id = data.tasklistId;
                delete(data.tasklistId);
            }

            config.data = JSON.stringify(data);

            return config;
        }, (error) => {
            return Promise.reject(error);
        });
    }

    sort(orderedTasks) {
        return this.server.patch([this.baseUrl, 'sort'].join('/'), orderedTasks);
    }
}

export default TaskService;
