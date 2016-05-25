var TaskList = React.createClass({
    render: function () {
        var taskNodes = this.props.tasks.map((task, index) => {
            var key = +Date.now();
            if (task.id) {
                key = task.id;
            }
            return (
                <Task key={key} {...task} index={index} handleTaskStatusChange={this.props.handleTaskStatusChange} handleTaskDelete={this.props.handleTaskDelete} moveTask={this.props.moveTask} dropTask={this.props.dropTask}/>
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
