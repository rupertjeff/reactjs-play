import React, {Component} from 'react';

class AddTaskListForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: ''
        };

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    render() {
        return (
            <form className="todo-list-add-list" onSubmit={this.handleSubmit}>
                <div className="form-group input-group">
                    <label htmlFor="tasklist-name" className="sr-only">Task List Name</label>
                    <input type="text" className="form-control" placeholder="New Task List Name" value={this.state.name} onChange={this.handleNameChange}/>
                    <span className="input-group-btn">
                        <button className="btn btn-success" type="submit">
                            <span className="fa fa-plus"><span className="sr-only">Create Task List</span></span>
                        </button>
                    </span>
                </div>
            </form>
        );
    }

    handleNameChange(e) {
        this.setState({
            name: e.target.value
        })
    }

    handleSubmit(e) {
        e.preventDefault();

        this.props.handleTaskListCreate(this.state);

        this.setState({
            name: ''
        });
    }
}

export default AddTaskListForm;
