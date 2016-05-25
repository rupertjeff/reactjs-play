var TaskService = (function (server, baseUrl) {
    server.interceptors.response.use((response) => {
        // process response from server here if need be?

        return Promise.resolve(response);
    }, (error) => {
        return Promise.reject(error);
    });

    function getTasks() {
        return server.get(baseUrl);
    }

    function getTask(id) {
        return server.get([baseUrl, id].join('/'));
    }

    function saveTask(task) {
        if (task.id) {
            return server.put([baseUrl, task.id].join('/'), task);
        }

        return server.post(baseUrl, task);
    }

    function deleteTask(task) {
        if (+task !== task) {
            task = task.id;
        }

        return server.delete([baseUrl, task].join('/'));
    }

    function updateSort(orderedTasks) {
        return server.patch([baseUrl, 'sort'].join('/'), orderedTasks);
    }

    return {
        all: getTasks,
        get: getTask,
        save: saveTask,
        delete: deleteTask,
        sort: updateSort
    };
})(window.axios.create(), [apiUrl, 'tasks'].join('/'));
