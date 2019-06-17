import { createStore, applyMiddleware, compose } from 'redux';
import ReduxThunk from 'redux-thunk';
import appReducer from '../reducers/sortReducer.js';

const initialState = {
  sortMethod: 'played.allTime',
  sort: -1,
  loadPagination: 50,
  isFetching: false,
  lastPaginationUpdate: Date.now(),
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  appReducer,
  initialState,
  composeEnhancers(applyMiddleware(ReduxThunk))
);

export default store;
