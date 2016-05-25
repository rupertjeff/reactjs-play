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
