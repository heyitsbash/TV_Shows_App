/* eslint-disable prettier/prettier */
export default function loadPaginationAction (pages) {
  return {
    type: 'LOAD_PAGINATION',
    payload: pages,
  };
}
