export default (state, action) => {
  switch (action.type) {
    case 'SET_SORTING':
      return {
        ...state,
        sort: state.sort === -1 ? 1 : -1,
      };
    case 'LOAD_PAGINATION':
      return {
        ...state,
        loadPagination: state.loadPagination + action.payload,
      };
    case 'IS_FETCHING':
      return {
        ...state,
        isFetching: action.payload,
      };
    case 'LAST_PAGINATION_UPDATE':
      return {
        ...state,
        lastPaginationUpdate: action.payload,
      };
    case 'SET_SORT_METHOD':
      return {
        ...state,
        sortMethod: action.payload,
      };
    default:
      return state;
  }
};
