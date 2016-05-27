import React from 'react';
import ReactDOM from 'react-dom';
import TodoList from './components/todoList';

// minor settings... no idea if this works or not.
// window.axios.defaults.headers.common['Accept'] = 'application/json';

ReactDOM.render(
    <TodoList/>,
    document.getElementById('todo-list')
);
