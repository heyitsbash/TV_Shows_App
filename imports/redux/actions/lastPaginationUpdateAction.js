export default () => {
  return {
    type: 'LAST_PAGINATION_UPDATE',
    payload: Date.now(),
  };
};
