/* eslint-disable prettier/prettier */
export default function sortReducer (state, action) {
  switch (action.type) {
    case 'SET_SORTING':
      return {
        ...state,
        sort: state.sort === -1 ? 1 : -1, 
      }
    default:
      return state;
  }
}
