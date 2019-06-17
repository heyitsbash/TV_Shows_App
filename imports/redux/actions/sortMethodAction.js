export default (method) => {
  return {
    type: 'SET_SORT_METHOD',
    payload: method,
  };
};
