import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import PropTypes from 'prop-types';

const Hello = () => {
  const [counter, setCounter] = useState(0);

  return (
    <div>
      <button type="button" onClick={() => setCounter(counter + 1)}>
        Click Me
      </button>
      <p>You have pressed the button {counter} times.</p>
    </div>
  );
};

Hello.propTypes = {};

Hello.displayName = 'Hello';
export default Hello;
