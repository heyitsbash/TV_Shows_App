import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import tasksSetChecked from '../redux/actions/checkTasks.js';
import tasksRemove from '../redux/actions/removeTask.js';

const Task = ({ show }) => {
  const dispatch = useDispatch();
  const checkTasks = (value) => dispatch(tasksSetChecked(value));
  const removeTask = (value) => dispatch(tasksRemove(value));

  const toggleChecked = () => {
    checkTasks(show);
  };

  const deleteTask = () => {
    removeTask(show);
  };

  const taskClassName = show.checked ? 'checked' : '';
  return (
    <li className={taskClassName}>
      <button onClick={deleteTask} type="button" className="delete">
        &times;
      </button>
      <input
        type="checkbox"
        readOnly
        checked={!!show.checked}
        onClick={toggleChecked}
      />
      <span className="text">{show.title}</span>
    </li>
  );
};

Task.propTypes = {
  show: PropTypes.object.isRequired,
};
Task.displayName = 'Task';
export default Task;
