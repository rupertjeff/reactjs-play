import React, {Component, PropTypes} from 'react';
import {DragSource, DropTarget} from 'react-dnd';
import ReactDOM from 'react-dom';
import {DraggableTypes, DroppableTypes} from './../objects/itemTypes';

class Task extends Component {
    constructor(props) {
        super(props);

        this.handleStatusChange = this.handleStatusChange.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    render() {
        let connectDragSource = this.props.connectDragSource,
            connectDragPreview = this.props.connectDragPreview,
            connectDropTarget = this.props.connectDropTarget;

        return connectDropTarget(connectDragPreview(
            <li className={'todo-list-task' + (this.props.isDragging ? ' placeholder' : '')}>
                {connectDragSource(
                    <span className="todo-list-task-handle">
                        <span className="fa fa-bars"><span className="sr-only">Move</span></span>
                    </span>
                )}
                <label className="checkbox todo-list-task-name">
                    <input type="checkbox" className="todo-list-task-checkbox" value="complete" checked={this.props.complete} onChange={this.handleStatusChange}/>
                    <span className="todo-list-task-name-value">{this.props.task}</span>
                </label>
                <button type="button" className="btn btn-danger btn-sm todo-list-task-delete" onClick={this.handleDelete}>&times;</button>
            </li>
        ));
    }

    handleStatusChange(e) {
        this.props.handleTaskStatusChange(this.props.id, !this.props.complete);
    }

    handleDelete(e) {
        this.props.handleTaskDelete(this.props.id);
    }
}

Task.propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDragPreview: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    moveTask: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired
};

const taskDragSource = {
        beginDrag: function (props) {
            return {
                id: props.id,
                tasklistId: props.tasklistId,
                index: props.index,
                type: DraggableTypes.TASK
            };
        }
    },
    taskDropTarget = {
        hover: (props, monitor, component) => {
            const dragIndex = monitor.getItem().index;
            const hoverIndex = props.index;

            if (dragIndex === hoverIndex) {
                return;
            }

            if (monitor.getItem().tasklistId !== props.tasklistId) {
                console.log(monitor.getItem().tasklistId, props.tasklistId);

                props.moveTaskToTasklist(dragIndex, monitor.getItem().tasklistId, hoverIndex, props.tasklistId);

                // See note below at end of function.
                monitor.getItem().tasklistId = props.tasklistId;
                monitor.getItem().index = hoverIndex;

                return;
            }

            // Use the below to mess around with when the items switch
            //
            // const hoverBoundingRect = ReactDOM.findDOMNode(component).getBoundingClientRect();
            // const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            // const clientOffset = monitor.getClientOffset();
            // const hoverClientY = clientOffset.y - hoverBoundingRect.top;
            //
            // // Restricting the move to when selected item is above/below 50% of hovered
            // // item, depending on the direction being moved by the user.
            // if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
            //     return;
            // }
            // if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
            //     return;
            // }

            props.moveTask(dragIndex, monitor.getItem().tasklistId, hoverIndex);

            // Not recommended in most cases, as this is a mutation action. According
            // to the docs, it helps significantly with performance, so it's allowed
            monitor.getItem().index = hoverIndex;
        },
        canDrop: (props, monitor) => DroppableTypes.TASK === monitor.getItem().type,
        drop: (props, monitor) => props.dropTask(monitor.getItem().tasklistId, props.tasklistId)
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

export default DropTarget(DraggableTypes.TASK, taskDropTarget, collectDrop)(DragSource(DroppableTypes.TASK, taskDragSource, collectDrag)(Task));
