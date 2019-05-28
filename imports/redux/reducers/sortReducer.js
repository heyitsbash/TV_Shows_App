/* eslint-disable prettier/prettier */
export default function appReducer (state, action) {
  switch (action.type) {
    case 'SET_SORTING':
      return {
        ...state,
        sort: state.sort === -1 ? 1 : -1, 
      }
    case 'LOAD_PAGINATION':
      return {
        ...state,
        loadPagination: state.loadPagination + action.payload,
      }
    default:
      return state;
  }
}
