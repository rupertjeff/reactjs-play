// config
var baseUrl = [
    window.baseUrl,
    'api'
].map(function (value) {
    return value
        .replace(/^\/+/, '')
        .replace(/\/+$/, '');
}).join('/');

window.axios.defaults.headers.common['Accept'] = 'application/json';

// TaskService
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
})(window.axios.create(), [baseUrl, 'tasks'].join('/'));

// Task Item
const DraggableTypes = {
    TASK: 'Task'
};

let taskDragSource = {
    beginDrag: function (props) {
        return {
            id: props.id,
            index: props.index
        };
    }
};

let taskDropTarget = {
    hover: function (props, monitor, component) {
        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.index;

        if (dragIndex === hoverIndex) {
            return;
        }

        const hoverBoundingRect = ReactDOM.findDOMNode(component).getBoundingClientRect();
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
        const clientOffset = monitor.getClientOffset();
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;

        // Restricting the move to when selected item is above/below 50% of hovered
        // item, depending on the direction being moved by the user.
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
            return;
        }
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
            return;
        }

        props.moveTask(dragIndex, hoverIndex);

        // Not recommended in most cases, as this is a mutation action. According
        // to the docs, it helps significantly with performance, so it's allowed
        monitor.getItem().index = hoverIndex;
    }
};

function collectDrag(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        connectDragPreview: connect.dragPreview(),
        isDragging: monitor.isDragging()
    };
}

function collectDrop(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver()
    };
}

var BaseTask = React.createClass({
    handleStatusChange: function (e) {
        this.props.handleTaskStatusChange(this.props.id, !this.props.complete);
    },
    handleDelete: function (e) {
        this.props.handleTaskDelete(this.props.id);
    },
    propTypes: {
        connectDragSource: React.PropTypes.func.isRequired,
        connectDragPreview: React.PropTypes.func.isRequired,
        connectDropTarget: React.PropTypes.func.isRequired,
        moveTask: React.PropTypes.func.isRequired,
        isDragging: React.PropTypes.bool.isRequired
    },
    render: function () {
        let connectDragSource = this.props.connectDragSource,
            connectDragPreview = this.props.connectDragPreview,
            connectDropTarget = this.props.connectDropTarget;

        return connectDragPreview(connectDropTarget(
            <li className="task-list-task">
                {connectDragSource(<button type="button">Move</button>)}
                <label className="task-list-task-name">
                    <input type="checkbox" className="task-list-task-checkbox" value="complete" checked={this.props.complete} onChange={this.handleStatusChange}/>
                    <span className="task-list-task-name-value">{this.props.task}</span>
                </label>
                <button type="button" onClick={this.handleDelete}>&times;</button>
            </li>
        ));
    }
});

let Task = ReactDnD.DropTarget(DraggableTypes.TASK, taskDropTarget, collectDrop)(ReactDnD.DragSource(DraggableTypes.TASK, taskDragSource, collectDrag)(BaseTask));

// TaskList
var TaskList = React.createClass({
    render: function () {
        var taskNodes = this.props.tasks.map((task) => {
            var key = +Date.now();
            if (task.id) {
                key = task.id;
            }
            return (
                <Task key={key} {...task} handleTaskStatusChange={this.props.handleTaskStatusChange} handleTaskDelete={this.props.handleTaskDelete} moveTask={this.props.moveTask}/>
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

// TaskForm
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

// TodoList
var BaseTodoList = React.createClass({
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
    moveTask: function (dragIndex, hoverIndex) {
        console.log('should move');
        const { tasks } = this.state.tasks;
        const dragTask = tasks[dragIndex];

        this.setState(React.update(this.state, {
            tasks: {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, dragTask]
                ]
            }
        }));
        // TaskService.sort(this.state.tasks).then(() => this.loadTasks());
    },
    render: function () {
        return (
            <div className="todo-list">
                <TaskList tasks={this.state.tasks} handleTaskStatusChange={this.handleTaskStatusChange} handleTaskDelete={this.handleTaskDelete} moveTask={this.moveTask}/>
                <TaskForm handleTaskSubmit={this.handleCreateTask}/>
            </div>
        );
    }
});

let TodoList = ReactDnD.DragDropContext(ReactDnDHTML5Backend)(BaseTodoList);

ReactDOM.render(
    <TodoList/>,
    document.getElementById('todo-list')
);
