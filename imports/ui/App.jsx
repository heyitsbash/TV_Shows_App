import React from 'react';
import Hello from './Hello.jsx';
import Info from './Info.jsx';

const App = () => {
  return (
    <div>
      <h1>Welcome to MMeteor!</h1>
      <Hello />
      <Info />
    </div>
  );
};

App.displayName = 'App';
export default App;
