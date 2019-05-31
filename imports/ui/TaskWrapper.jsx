import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { useDispatch } from 'react-redux';
import tasksInsert from '../redux/actions/insertTask.js';
import sortAction from '../redux/actions/sortAction.js';
import callTrakt from '../redux/actions/tracktCall.js';
import loadPaginationAction from '../redux/actions/loadPaginationAction.js';
import Tasks from '../api/collections/tasks.js';
import Task from './Task.jsx';

const TaskWrapper = ({ tasks, incompleteCount }) => {
  const [inputVal, setInputVal] = useState('');
  const [hideCompleted, setHideCompleted] = useState(false);

  const dispatch = useDispatch();
  const insertTask = (text) => dispatch(tasksInsert(text));
  const sortingAction = () => dispatch(sortAction());
  const callingTrakt = (url) => dispatch(callTrakt(url));
  const paginationLoad = (pages) => dispatch(loadPaginationAction(pages));

  const renderTasks = () => {
    let filteredTasks = tasks;
    if (hideCompleted) {
      filteredTasks = filteredTasks.filter((task) => !task.checked);
    }
    return filteredTasks.map((task) => <Task key={task._id} task={task} />);
  };

  const changeListOrder = () => {
    sortingAction();
  };

  const testAPIcall = () => {
    callingTrakt('https://api.trakt.tv/shows/trending');
  };

  const loadMorePages = () => {
    paginationLoad(5);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = inputVal.trim();
    if (text === '') {
      return;
    }
    insertTask(text);
    setInputVal('');
  };

  return (
    <div className="container">
      <header>
        <h1>Todo List - {incompleteCount}</h1>
        <button type="button" onClick={changeListOrder}>
          Order
        </button>
        <button type="button" onClick={testAPIcall}>
          Test API
        </button>
        <button type="button" onClick={loadMorePages}>
          Load More
        </button>
        <label htmlFor="hideCompletedInputId" className="hide-completed">
          <input
            id="hideCompletedInputId"
            type="checkbox"
            readOnly
            checked={hideCompleted}
            onClick={() => setHideCompleted(!hideCompleted)}
          />
          Hide completed tasks
        </label>
        <form onSubmit={handleSubmit} className="new-task">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="type your task"
          />
        </form>
      </header>
      <ul>{renderTasks()}</ul>
    </div>
  );
};

TaskWrapper.propTypes = {
  tasks: PropTypes.array.isRequired,
  incompleteCount: PropTypes.number.isRequired,
};

TaskWrapper.displayName = 'TaskWrapper';

export default withTracker((props) => {
  const { loadPagination } = props.storeValue;
  Meteor.subscribe('tasks', loadPagination);
  const sortMethod = props.storeValue.sort;

  return {
    tasks: Tasks.find({}, { sort: { createdAt: sortMethod } }).fetch(),
    incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
  };
})(TaskWrapper);
