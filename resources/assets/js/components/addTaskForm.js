import React, {Component} from 'react';

class AddTaskForm extends Component {
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
                <div className="form-group">
                    <label htmlFor="task-name" className="sr-only">Task Name</label>
                    <div className="input-group">
                        <input type="text" className="form-control" id="task-name" name="task[name]" placeholder="What do you need to do?" value={this.state.task} onChange={this.handleTaskChange}/>
                        <span className="input-group-btn">
                            <button type="submit" className="btn btn-success">
                                <span className="sr-only">Add</span><span className="fa fa-plus"/>
                            </button>
                        </span>
                    </div>
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

        this.props.handleTaskCreate({
            task: this.state.task.trim(),
            tasklistId: this.props.tasklistId
        });

        this.setState({
            task: ''
        });
    }

    isFormValid() {
        return this.state.task.trim();
    }
}

export default AddTaskForm;
