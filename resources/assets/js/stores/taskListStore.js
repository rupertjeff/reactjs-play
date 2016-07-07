import Store from './store';
import TaskListService from '../services/tasklists';
import TodoDispatcher from './../dispatchers/todoDispatcher';

const taskListService = new TaskListService();
let tasklists = taskListService.all();

class TaskListStore extends Store {

    get(id) {
        if (id) {
            return tasklists.filter((element) => element.id === id).first();
        }

        return tasklists;
    }

}

TaskListStore.dispatchToken = TodoDispatcher.register((action) => {

    switch (action.type) {

        case TodoActions.CREATE:
            break;

        default:

    }

});

export default TaskListStore;
