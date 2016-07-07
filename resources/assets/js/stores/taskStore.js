import Store from './store';
import TodoDispatcher from './../dispatchers/todoDispatcher';

let tasks = [];

class TaskStore extends Store {

    get(id) {
        if (id) {
            return tasks.filter((element) => element.id === id);
        }

        return tasks;
    }

    getByTasklistId(id) {
        return tasks.filter((element) => element.tasklist_id === id);
    }

}

TaskStore.dispatchToken = TodoDispatcher.register((action) => {});

export default TaskStore;
