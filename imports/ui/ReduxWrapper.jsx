/* eslint-disable prettier/prettier */
import React from 'react';
import { useSelector } from 'react-redux';
import TaskWrapper from './TaskWrapper';

const ReduxWrapper = () => {
  const storeValue = useSelector((value) => value);

  return (
    <div>
      <TaskWrapper storeValue={storeValue} />
    </div>
  );
};


ReduxWrapper.displayName = 'ReduxWrapper';
export default ReduxWrapper;
