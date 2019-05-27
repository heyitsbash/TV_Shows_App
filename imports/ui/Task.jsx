/* eslint-disable prettier/prettier */
import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import tasksSetChecked from "../redux/actions/checkTasks";
import tasksRemove from "../redux/actions/removeTask";

const Task = ({ task }) => {
  const dispatch = useDispatch();
  const checkTasks = (value) => dispatch(tasksSetChecked(value));
  const removeTask = (value) => dispatch(tasksRemove(value));

  const toggleChecked = () => {
    checkTasks(task);
  };

  const deleteTask = () => {
    removeTask(task);
  };

  const taskClassName = task.checked ? 'checked' : '';
  return (
    <li className={taskClassName}>
      <button
        onClick={deleteTask}
        type="button"
        className="delete"
      >
        &times;
      </button>
      <input
        type="checkbox"
        readOnly
        checked={!!task.checked}
        onClick={toggleChecked}
      />
      <span className="text">{task.text}</span>
    </li>
  );
};

Task.propTypes = {
  task: PropTypes.object.isRequired,
};
Task.displayName = 'Task';
export default Task;
