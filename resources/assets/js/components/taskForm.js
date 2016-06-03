import React, {Component} from 'react';

class TaskForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            task: ''
        };

        this.handleTaskChange = this.handleTaskChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.isFormValid = this.isFormValid.bind(this);
    }

    render() {
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

    handleTaskChange(e) {
        this.setState({
            task: e.target.value
        });
    }

    handleSubmit(e) {
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
    }

    isFormValid() {
        return this.state.task.trim();
    }
}

export default TaskForm;
