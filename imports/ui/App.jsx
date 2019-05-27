import React from 'react';
import { Provider } from 'react-redux';
import store from '../redux/store/store';
import ReduxWrapper from './ReduxWrapper';

const App = () => {
  return (
    <div>
      <Provider store={store}>
        <ReduxWrapper />
      </Provider>
    </div>
  );
};

App.displayName = 'App';
export default App;
