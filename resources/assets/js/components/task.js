import React, {Component, PropTypes} from 'react';
import {DragSource, DropTarget} from 'react-dnd';
import ReactDOM from 'react-dom';

class Task extends Component {
    render() {
        let connectDragSource = this.props.connectDragSource,
            connectDragPreview = this.props.connectDragPreview,
            connectDropTarget = this.props.connectDropTarget,
            opacity = this.props.isDragging ? 0 : 1;

        return connectDropTarget(connectDragPreview(
            <li className="task-list-task" style={{opacity}}>
                {connectDragSource(<button type="button">Move</button>)}
                <label className="task-list-task-name">
                    <input type="checkbox" className="task-list-task-checkbox" value="complete" checked={this.props.complete} onChange={this.handleStatusChange}/>
                    <span className="task-list-task-name-value">{this.props.task}</span>
                </label>
                <button type="button" onClick={this.handleDelete}>&times;</button>
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

const DraggableTypes = {
    TASK: 'Task'
};

let taskDragSource = {
    beginDrag: function (props) {
        return {
            id: props.id,
            index: props.index
        };
    }
};

let taskDropTarget = {
    hover: function (props, monitor, component) {
        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.index;

        if (dragIndex === hoverIndex) {
            return;
        }

        const hoverBoundingRect = ReactDOM.findDOMNode(component).getBoundingClientRect();
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
        const clientOffset = monitor.getClientOffset();
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;

        // Restricting the move to when selected item is above/below 50% of hovered
        // item, depending on the direction being moved by the user.
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
            return;
        }
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
            return;
        }

        props.moveTask(dragIndex, hoverIndex);

        // Not recommended in most cases, as this is a mutation action. According
        // to the docs, it helps significantly with performance, so it's allowed
        monitor.getItem().index = hoverIndex;
    },
    drop: function (props) {
        props.dropTask();
    }
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

export default DropTarget(DraggableTypes.TASK, taskDropTarget, collectDrop)(DragSource(DraggableTypes.TASK, taskDragSource, collectDrag)(Task));
