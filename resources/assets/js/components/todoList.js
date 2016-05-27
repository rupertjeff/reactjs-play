import React, {Component} from 'react';
import {DragDropContext} from 'react-dnd';
import ReactDnDHTML5Backend from 'react-dnd-html5-backend';
import update from 'react/lib/update';
import TaskService from '../services/tasks';

import TaskList from './taskList';
import TaskForm from './taskForm';

class BaseTodoList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tasks: []
        };
        this.taskService = new TaskService();
        this.moveTask = this.moveTask.bind(this);
        this.dropTask = this.dropTask.bind(this);
    }

    // React-specific functions
    componentDidMount() {
        this.loadTasks();
    }

    render() {
        return (
            <div className="todo-list">
                <TaskList tasks={this.state.tasks} handleTaskStatusChange={this.handleTaskStatusChange} handleTaskDelete={this.handleTaskDelete} moveTask={this.moveTask} dropTask={this.dropTask}/>
                <TaskForm handleTaskSubmit={this.handleCreateTask}/>
            </div>
        );
    }

    // ReactDnD related functions
    dropTask() {
        this.taskService.sort({
            'ids': this.state.tasks.map((task) => task.id)
        }).then(() => this.loadTasks());
    }

    moveTask(dragIndex, hoverIndex) {
        const {tasks} = this.state;
        const dragTask = tasks[dragIndex];

        this.setState(update(this.state, {
            tasks: {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, dragTask]
                ]
            }
        }));
    }

    // TodoList-specific functions
    loadTasks() {
        this.taskService.all().then((response) => {
            this.setState({
                tasks: response.data
            });
        });
    }

    handleCreateTask(task) {
        this.setState({
            tasks: this.state.tasks.concat([task])
        });
        this.taskService.save(task).then(() => this.loadTasks());
    }

    handleTaskStatusChange(id, newStatus) {
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

        this.taskService.save(task).then(() => this.loadTasks());
    }

    handleTaskDelete(id) {
        let tasks = this.state.tasks.filter((element) => id !== element.id);

        this.setState({
            tasks: tasks
        });

        this.taskService.delete(id);
    }
}

export default DragDropContext(ReactDnDHTML5Backend)(BaseTodoList);
