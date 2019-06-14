export default (bool) => {
  return {
    type: 'IS_FETCHING',
    payload: bool,
  };
};
