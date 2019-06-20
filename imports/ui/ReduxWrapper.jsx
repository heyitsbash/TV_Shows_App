import React from 'react';
import { useSelector } from 'react-redux';
import TableWrapper from './TableWrapper.jsx';

const ReduxWrapper = () => {
  const storeValue = useSelector((value) => value);

  return (
    <div>
      <TableWrapper storeValue={storeValue} />
    </div>
  );
};

ReduxWrapper.displayName = 'ReduxWrapper';
export default ReduxWrapper;
