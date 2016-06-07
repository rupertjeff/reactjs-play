import React, {Component} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import Task from './task';
import AddTaskForm from './addTaskForm';

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
            <div className="todo-list">
                <h2>Tasks</h2>
                <ul className="todo-list-listing">
                    <ReactCSSTransitionGroup transitionName="task-list-update" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
                        {taskNodes}
                    </ReactCSSTransitionGroup>
                </ul>
                <AddTaskForm handleTaskSubmit={this.props.handleCreateTask}/>
            </div>
        );
    }
}

export default TaskList;
