export default (pages) => {
  return {
    type: 'LOAD_PAGINATION',
    payload: pages,
  };
};
