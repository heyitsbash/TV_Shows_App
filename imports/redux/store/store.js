import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import sortReducer from '../reducers/sortReducer';

const initialState = {
  sort: -1,
};

const store = createStore(
  sortReducer,
  initialState,
  applyMiddleware(ReduxThunk)
);
export default store;
