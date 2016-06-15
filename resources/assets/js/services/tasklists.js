import BaseService from './base';
import isArray from '../helpers/isArray';

class TaskListService extends BaseService {
    constructor() {
        super('tasklists');

        this.server.interceptors.response.use((response) => {
            if (isArray(response.data)) {
                return Promise.resolve({
                    data: response.data.map((tasklist) => {
                        tasklist.tasks = tasklist.tasks.data;

                        return tasklist;
                    })
                });
            }

            response.data.tasks = response.data.tasks.data;

            return Promise.resolve(response.data);
        }, (error) => {
            return Promise.reject(error);
        });
    }

    sort(orderedTaskLists) {
        return this.server.patch([this.baseUrl, 'sort'].join('/'), orderedTaskLists);
    }
}

export default TaskListService;
