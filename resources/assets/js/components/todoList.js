import React, {Component} from 'react';
import {DragDropContext} from 'react-dnd';
import ReactDnDHTML5Backend from 'react-dnd-html5-backend';
import update from 'react/lib/update';
import TaskService from '../services/tasks';
import TaskListService from '../services/tasklists';

import TaskList from './taskList';
import AddTaskListForm from './addTaskListForm';

class BaseTodoList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tasklists: []
        };
        this.taskService = new TaskService();
        this.taskListService = new TaskListService();
        this.moveTasklist = this.moveTasklist.bind(this);
        this.dropTasklist = this.dropTasklist.bind(this);
        this.handleCreateTaskList = this.handleCreateTaskList.bind(this);
        this.handleDeleteTaskList = this.handleDeleteTaskList.bind(this);
        this.moveTask = this.moveTask.bind(this);
        this.moveTaskToTasklist = this.moveTaskToTasklist.bind(this);
        this.dropTask = this.dropTask.bind(this);
        this.handleCreateTask = this.handleCreateTask.bind(this);
        this.handleTaskStatusChange = this.handleTaskStatusChange.bind(this);
        this.handleTaskDelete = this.handleTaskDelete.bind(this);
    }

    // React-specific functions
    componentDidMount() {
        this.loadTaskLists();
    }

    render() {
        let taskListNodes = this.state.tasklists.map((tasklist, index) => {
            let key = +Date.now();
            if (tasklist.id) {
                key = tasklist.id;
            }

            return (
                <TaskList
                    key={key}
                    {...tasklist}
                    index={index}
                    moveTasklist={this.moveTasklist}
                    dropTasklist={this.dropTasklist}
                    handleTaskListCreate={this.handleCreateTaskList}
                    handleTaskListDelete={this.handleDeleteTaskList}
                    moveTask={this.moveTask}
                    moveTaskToTasklist={this.moveTaskToTasklist}
                    dropTask={this.dropTask}
                    handleTaskCreate={this.handleCreateTask}
                    handleTaskStatusChange={this.handleTaskStatusChange}
                    handleTaskDelete={this.handleTaskDelete}
                />
            );
        });

        return (
            <div className="todo-list-holder">
                {taskListNodes}
                <AddTaskListForm handleTaskListCreate={this.handleCreateTaskList}/>
            </div>
        );
    }

    // ReactDnD related functions
    dropTask(dragTasklistId, dropTasklistId) {
        if (dragTasklistId === dropTasklistId) {
            const tasklist = this.state.tasklists.filter((element) => dragTasklistId === element.id).shift();

            this.taskService.sort({
                ids: tasklist.tasks.map((task) => task.id)
            }).then(() => this.loadTaskList(tasklist.id));
        }
    }

    moveTask(dragIndex, dragTasklistId, hoverIndex) {
        const tasklist = this.state.tasklists.filter((element) => dragTasklistId === element.id).shift();
        const dragTask = tasklist.tasks[dragIndex];

        this.setState({
            tasklists: this.state.tasklists.map((element) => {
                if (element.id === dragTasklistId) {
                    return update(tasklist, {
                        tasks: {
                            $splice: [
                                [dragIndex, 1],
                                [hoverIndex, 0, dragTask]
                            ]
                        }
                    });
                }

                return element;
            })
        });
    }

    moveTaskToTasklist(dragIndex, currentTasklistId, hoverIndex, newTasklistId) {
        const oldTasklist = this.state.tasklists.filter((element) => currentTasklistId === element.id).shift();
        const newTasklist = this.state.tasklists.filter((element) => newTasklistId === element.id).shift();
        const dragTask = oldTasklist.tasks[dragIndex];

        this.setState({
            tasklists: this.state.tasklists.map((element) => {
                if (element.id === currentTasklistId) {
                    return update(oldTasklist, {
                        tasks: {
                            $splice: [
                                [dragIndex, 1]
                            ]
                        }
                    });
                }

                if (element.id === newTasklistId) {
                    return update(newTasklist, {
                        tasks: {
                            $splice: [
                                [hoverIndex, 0, dragTask]
                            ]
                        }
                    });
                }

                return element;
            })
        });
    }

    dropTasklist() {
        this.taskListService.sort({
            'ids': this.state.tasklists.map((tasklist) => tasklist.id)
        }).then(() => this.loadTaskLists());
    }

    moveTasklist(dragIndex, hoverIndex) {
        const {tasklists} = this.state;
        const dragList = tasklists[dragIndex];

        this.setState(update(this.state, {
            tasklists: {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, dragList]
                ]
            }
        }));
    }

    // Tasklist-specific functions
    loadTaskLists() {
        this.taskListService.all().then((response) => {
            this.setState({
                tasklists: response.data
            });
        });
    }

    loadTaskList(tasklistId) {
        this.taskListService.get(tasklistId).then((response) => {
            this.setState({
                tasklists: this.state.tasklists.map((tasklist) => {
                    if (tasklist.id === response.id) {
                        return response;
                    }

                    return tasklist;
                })
            });
        });
    }

    handleCreateTaskList(tasklist) {
        this.setState({
            tasklists: this.state.tasklists.concat([tasklist])
        });
        this.taskListService.save(tasklist).then(() => this.loadTaskLists());
    }

    handleDeleteTaskList(id) {
        let tasklists = this.state.tasklists.filter((element) => id !== element.id);

        this.setState({
            tasklists: tasklists
        });

        this.taskListService.delete(id).then(() => this.loadTaskLists());
    }

    // Task-specific functions
    handleCreateTask(task) {
        let tasklist = this.state.tasklists.filter((element) => task.tasklistId === element.id).shift();
        let tasklistId = task.tasklistId;

        delete(task.tasklistId);
        tasklist.tasks = tasklist.tasks.concat([task]);
        task.tasklistId = tasklistId;

        this.setState({
            tasklists: this.state.tasklists.map((value) => {
                if (tasklist.id === value.id) {
                    return tasklist;
                }

                return value;
            })
        });
        this.taskService.save(task).then(() => this.loadTaskList(tasklistId));
    }

    handleTaskStatusChange(id, tasklistId, newStatus) {
        let tasklist = this.state.tasklists.filter((element) => tasklistId === element.id).shift();
        let task = tasklist.tasks.filter((element) => id === element.id).shift();

        task.complete = newStatus;

        tasklist.tasks = tasklist.tasks.map((value) => {
            if (id === value.id) {
                return task;
            }

            return value;
        });

        this.setState({
            tasklists: this.state.tasklists.map((value) => {
                if (tasklistId === value.id) {
                    return tasklist;
                }

                return value;
            })
        });
        this.taskListService.save(tasklist).then(() => this.loadTaskLists());
    }

    handleTaskDelete(id, tasklistId) {
        let tasklist = this.state.tasklists.filter((element) => tasklistId === element.id).shift();
        tasklist.tasks = tasklist.tasks.filter((element) => id !== element.id);

        this.setState({
            tasklists: this.state.tasklists.map((element) => {
                if (tasklistId === element.id) {
                    return tasklist;
                }

                return element;
            })
        });

        this.taskService.delete(id).then(() => this.loadTaskLists());
    }
}

export default DragDropContext(ReactDnDHTML5Backend)(BaseTodoList);
