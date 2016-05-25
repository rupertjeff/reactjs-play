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
        const { tasks } = this.state;
        const dragTask = tasks[dragIndex];

        this.setState(React.addons.update(this.state, {
            tasks: {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, dragTask]
                ]
            }
        }));
    },
    dropTask: function () {
        TaskService.sort({
            'ids': this.state.tasks.map((task) => task.id)
        }).then(() => this.loadTasks());
    },
    render: function () {
        return (
            <div className="todo-list">
                <TaskList tasks={this.state.tasks} handleTaskStatusChange={this.handleTaskStatusChange} handleTaskDelete={this.handleTaskDelete} moveTask={this.moveTask} dropTask={this.dropTask}/>
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
