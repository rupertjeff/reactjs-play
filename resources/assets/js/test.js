var baseUrl = [
    window.baseUrl,
    'api'
].map(function (value) {
    return value
        .replace(/^\/+/, '')
        .replace(/\/+$/, '');
}).join('/');

window.axios.defaults.headers.common['Accept'] = 'application/json';

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

    return {
        all: getTasks,
        get: getTask,
        save: saveTask,
        delete: deleteTask
    };
})(window.axios.create(), [baseUrl, 'tasks'].join('/'));

var Task = React.createClass({
    handleStatusChange: function (e) {
        this.props.handleTaskStatusChange(this.props.id, !this.props.complete);
    },
    handleDelete: function (e) {
        this.props.handleTaskDelete(this.props.id);
    },
    render: function () {
        return (
            <li className="task-list-task">
                <label className="task-list-task-name">
                    <input type="checkbox" className="task-list-task-checkbox" value="complete" checked={this.props.complete} onChange={this.handleStatusChange}/>
                    <span className="task-list-task-name-value">{this.props.task}</span>
                </label>
                <button type="button" onClick={this.handleDelete}>&times;</button>
            </li>
        );
    }
});

var TaskList = React.createClass({
    render: function () {
        var taskNodes = this.props.tasks.map((task) => {
            var key = +Date.now();
            if (task.id) {
                key = task.id;
            }
            return (
                <Task key={key} {...task} handleTaskStatusChange={this.props.handleTaskStatusChange} handleTaskDelete={this.props.handleTaskDelete}/>
            );
        });

        return (
            <div className="todo-list-listing">
                <h2>Tasks</h2>
                <ul>
                    {taskNodes}
                </ul>
            </div>
        );
    }
});

var TaskForm = React.createClass({
    getInitialState: function () {
        return {
            task: ''
        };
    },
    isFormValid: function () {
        return this.state.task.trim();
    },
    handleTaskChange: function (e) {
        this.setState({
            task: e.target.value
        });
    },
    handleSubmit: function (e) {
        e.preventDefault();

        if (!this.isFormValid()) {
            return;
        }

        this.props.handleTaskSubmit({
            task: this.state.task.trim()
        });

        this.setState({
            task: ''
        });
    },
    render: function () {
        return (
            <form class="todo-list-form" onSubmit={this.handleSubmit}>
                <h2>Add Task</h2>
                <div className="form-group">
                    <label htmlFor="task-name">Task Name</label>
                    <input type="text" id="task-name" name="task[name]" value={this.state.task} onChange={this.handleTaskChange}/>
                </div>
                <div className="form-group form-actions">
                    <button type="submit">Add</button>
                </div>
            </form>
        );
    }
});

var TodoList = React.createClass({
    getInitialState: function () {
        return {
            tasks: []
        };
    },
    componentDidMount: function () {
        this.loadTasks();
    },
    handleCreateTask: function (task) {
        this.setState({
            tasks: this.state.tasks.concat([task])
        });
        TaskService.save(task).then(() => this.loadTasks());
    },
    handleTaskStatusChange: function (id, newStatus) {
        let task = this.state.tasks.filter((element) => id === element.id).shift();

        task.complete = newStatus;

        this.setState({
            tasks: this.state.tasks.map((value) => {
                if (id === value.id) {
                    return task;
                }

                return value;
            })
        });

        TaskService.save(task).then(() => this.loadTasks());
    },
    handleTaskDelete: function (id) {
        let tasks = this.state.tasks.filter((element) => id !== element.id);

        this.setState({
            tasks: tasks
        });

        TaskService.delete(id);
    },
    loadTasks: function () {
        TaskService.all().then((response) => {
            this.setState({
                tasks: response.data.data
            });
        }).catch((error) => {
        });
    },
    render: function () {
        return (
            <div className="todo-list">
                <TaskList tasks={this.state.tasks} handleTaskStatusChange={this.handleTaskStatusChange} handleTaskDelete={this.handleTaskDelete}/>
                <TaskForm handleTaskSubmit={this.handleCreateTask}/>
            </div>
        );
    }
});

ReactDOM.render(
    <TodoList/>,
    document.getElementById('todo-list')
);
