import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { useDispatch } from 'react-redux';
import tasksInsert from '../redux/actions/insertTask.js';
import sortAction from '../redux/actions/sortAction.js';
import callTrakt from '../redux/actions/tracktCall.js';
import loadPaginationAction from '../redux/actions/loadPaginationAction.js';
import tvShows from '../api/collections/tvShows.js';
import Task from './Task.jsx';

const TaskWrapper = ({ shows, incompleteCount }) => {
  const [inputVal, setInputVal] = useState('');
  const [hideCompleted, setHideCompleted] = useState(false);

  const dispatch = useDispatch();
  const insertTask = (text) => dispatch(tasksInsert(text));
  const sortingAction = () => dispatch(sortAction());
  const callingTrakt = (url) => dispatch(callTrakt(url));
  const paginationLoad = (pages) => dispatch(loadPaginationAction(pages));

  const renderTasks = () => {
    let filteredTasks = shows;
    if (hideCompleted) {
      filteredTasks = filteredTasks.filter((show) => !show.checked);
    }
    return filteredTasks.map((show) => <Task key={show._id} show={show} />);
  };

  const changeListOrder = () => {
    sortingAction();
  };

  // const page = 0;
  const testAPIcall = () => {
    callingTrakt('https://api.trakt.tv/shows/watched/all?page=1&limit=5');
    // callingTrakt('https://api.trakt.tv/shows/1390?extended=full');
    // page += 1;
    // console.log(page);
    // const url = `https://api.trakt.tv/shows/watched/all?page=${page}&limit=1`;
    // console.log(url);
    // Meteor.call('callTraktAPI', url);
    // callingTrakt(url);
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
          Hide completed shows
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
  shows: PropTypes.array.isRequired,
  incompleteCount: PropTypes.number.isRequired,
};

TaskWrapper.displayName = 'TaskWrapper';

export default withTracker((props) => {
  const { loadPagination } = props.storeValue;
  Meteor.subscribe('tvShows', loadPagination);
  const sortMethod = props.storeValue.sort;

  return {
    shows: tvShows
      .find({}, { sort: { 'watched.allTime': sortMethod } })
      .fetch(),
    incompleteCount: tvShows.find({ checked: { $ne: true } }).count(),
  };
})(TaskWrapper);
