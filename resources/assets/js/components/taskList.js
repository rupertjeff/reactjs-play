import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {DragSource, DropTarget} from 'react-dnd';
// import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import {DraggableTypes, DroppableTypes} from './../objects/itemTypes';
import Task from './task';
import AddTaskForm from './addTaskForm';

class TaskList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: this.props.name || 'Tasks'
        };

        this.deleteTaskList = this.deleteTaskList.bind(this);
        this.moveTask = this.moveTask.bind(this);
        this.moveTaskToTasklist = this.moveTaskToTasklist.bind(this);
        this.dropTask = this.dropTask.bind(this);
        this.handleTaskDelete = this.handleTaskDelete.bind(this);
    }

    render() {
        let taskNodes = [],
            connectDragSource = this.props.connectDragSource,
            connectDragPreview = this.props.connectDragPreview,
            connectDropTarget = this.props.connectDropTarget;

        if (this.props.tasks instanceof Array) {
            taskNodes = this.props.tasks.map((task, index) => {
                let key = +Date.now();
                if (task.id) {
                    key = task.id;
                }

                return (
                    <Task
                        key={key}
                        {...task}
                        index={index}
                        handleTaskStatusChange={this.props.handleTaskStatusChange}
                        handleTaskDelete={this.handleTaskDelete}
                        moveTask={this.moveTask}
                        moveTaskToTasklist={this.moveTaskToTasklist}
                        dropTask={this.dropTask}
                    />
                );
            });
        }

        // <ReactCSSTransitionGroup transitionName="task-list-update" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
        return connectDropTarget(connectDragPreview(
            <div className={'todo-list' + (this.props.isDragging ? ' placeholder' : '')}>
                <header className="todo-list-header">
                    {connectDragSource(
                        <span className="todo-list-handle">
                            <span className="fa fa-bars"><span className="sr-only">Move</span></span>
                        </span>
                    )}
                    <h2 className="todo-list-header-name">{this.state.name}</h2>
                    <button className="btn btn-danger todo-list-delete" onClick={this.deleteTaskList}>
                        <span className="sr-only">Delete Task List</span> &times;
                    </button>
                </header>
                <ul className="todo-list-listing">
                    {taskNodes}
                </ul>
                <AddTaskForm handleTaskCreate={this.props.handleTaskCreate} tasklistId={this.props.id}/>
            </div>
        ));
    }

    deleteTaskList() {
        return this.props.handleTaskListDelete(this.props.id);
    }

    moveTask(dragIndex, dragTasklistId, hoverIndex) {
        return this.props.moveTask(dragIndex, dragTasklistId, hoverIndex);
    }
    
    moveTaskToTasklist(dragIndex, currentTasklistId, hoverIndex, newTasklistId) {
        return this.props.moveTaskToTasklist(dragIndex, currentTasklistId, hoverIndex, newTasklistId);
    }

    dropTask(dragTasklistId, dropTasklistId) {
        return this.props.dropTask(dragTasklistId, dropTasklistId);
    }
    
    handleTaskDelete(taskId) {
        return this.props.handleTaskDelete(taskId, this.props.id);
    }
}

TaskList.propTypes = {
    moveTasklist: PropTypes.func.isRequired,
    dropTasklist: PropTypes.func.isRequired,
    handleTaskListDelete: PropTypes.func.isRequired,

    moveTask: PropTypes.func.isRequired,
    dropTask: PropTypes.func.isRequired,
    handleTaskCreate: PropTypes.func.isRequired,
    handleTaskStatusChange: PropTypes.func.isRequired,
    handleTaskDelete: PropTypes.func.isRequired,

    // ReactDnD added
    connectDragSource: PropTypes.func.isRequired,
    connectDragPreview: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired
};

let taskListDragSource = {
        beginDrag: (props, monitor, component) => {
            return {
                id: props.id,
                index: props.index,
                type: DraggableTypes.TASKLIST,
                dragRect: ReactDOM.findDOMNode(component).getBoundingClientRect()
            };
        }
    },
    taskListDropTarget = {
        hover: (props, monitor, component) => {
            const dragIndex = monitor.getItem().index;
            const hoverIndex = props.index;

            if (dragIndex === hoverIndex) {
                return;
            }

            const hoverBoundingRect = ReactDOM.findDOMNode(component).getBoundingClientRect();
            const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
            // const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientX = clientOffset.x - hoverBoundingRect.left;
            // const hoverClientY = clientOffset.y - hoverBoundingRect.top;
            const clientWidth = monitor.getItem().dragRect.width / 2;

            // Restricting the move to when mouse cursor is above/below 50% of
            // hovered item, depending on the direction being moved by the user.
            if (dragIndex < hoverIndex && hoverClientX + clientWidth < hoverMiddleX) {
                return;
            }
            if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
                return;
            }

            props.moveTasklist(dragIndex, hoverIndex);

            // Not recommended in most cases, as this is a mutation action. According
            // to the docs, it helps significantly with performance, so it's allowed
            monitor.getItem().index = hoverIndex;
        },
        canDrop: (props, monitor) => DroppableTypes.TASKLIST === monitor.getItem().type,
        drop: (props) => props.dropTasklist()
    };

function collectDrag(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        connectDragPreview: connect.dragPreview(),
        isDragging: monitor.isDragging()
    };
}

function collectDrop(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver()
    };
}

export default DropTarget(DroppableTypes.TASKLIST, taskListDropTarget, collectDrop)(DragSource(DraggableTypes.TASKLIST, taskListDragSource, collectDrag)(TaskList));
