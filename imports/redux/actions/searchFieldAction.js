export default (string) => {
  return {
    type: 'SET_SEARCH_FIELD',
    payload: string,
  };
};
