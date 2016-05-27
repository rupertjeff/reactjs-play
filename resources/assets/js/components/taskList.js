import React, {Component} from 'react';

import Task from './task'

class TaskList extends Component {
    render() {
        let taskNodes = this.props.tasks.map((task, index) => {
            let key = +Date.now();
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
}

export default TaskList;
