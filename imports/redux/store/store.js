import { createStore, applyMiddleware, compose } from 'redux';
import ReduxThunk from 'redux-thunk';
import appReducer from '../reducers/sortReducer.js';

const initialState = {
  sort: -1,
  loadPagination: 5,
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  appReducer,
  initialState,
  composeEnhancers(applyMiddleware(ReduxThunk))
);

export default store;
