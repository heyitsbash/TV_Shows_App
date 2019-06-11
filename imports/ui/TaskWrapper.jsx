import React from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { useDispatch } from 'react-redux';
import {
  Column,
  Table,
  AutoSizer,
  WindowScroller,
  InfiniteLoader,
} from 'react-virtualized';
import sortAction from '../redux/actions/sortAction.js';
import callTrakt from '../redux/actions/tracktCall.js';
import loadPaginationAction from '../redux/actions/loadPaginationAction.js';
import tvShows from '../api/collections/tvShows.js';

const TaskWrapper = ({ shows, showCount }) => {
  const dispatch = useDispatch();
  const sortingAction = () => dispatch(sortAction());
  const callingTrakt = (url) => dispatch(callTrakt(url));
  const paginationLoad = (pages) => dispatch(loadPaginationAction(pages));

  const changeListOrder = () => {
    sortingAction();
  };

  const testAPIcall = () => {
    callingTrakt('https://api.trakt.tv/shows/464?extended=full');
  };

  const loadMorePages = () => {
    paginationLoad(20);
  };

  // eslint-disable-next-line react/prop-types
  const renderImageCell = ({ cellData }) => {
    const image = `https://image.tmdb.org/t/p/w780${cellData}`;
    return (
      <div className="tableImg" style={{ backgroundImage: `url(${image})` }} />
    );
  };

  const renderIndexCell = ({ rowIndex }) => {
    const index = rowIndex + 1;
    return index;
  };

  renderImageCell.displayName = 'renderImageCell';

  return (
    <div className="container">
      <div className="tableHeader">
        <button type="button" onClick={changeListOrder}>
          Order
        </button>
        <button type="button" onClick={testAPIcall}>
          Test API
        </button>
        <button type="button" onClick={loadMorePages}>
          Load More
        </button>
      </div>
      <div>
        <InfiniteLoader
          isRowLoaded={({ index }) => !!shows[index]}
          loadMoreRows={loadMorePages}
          rowCount={100000000}
        >
          {({ onRowsRendered, registerChild }) => (
            <WindowScroller>
              {({ height, scrollTop }) => (
                <AutoSizer disableHeight>
                  {({ width }) => (
                    <Table
                      autoHeight
                      overscanRowCount={4}
                      ref={registerChild}
                      onRowsRendered={onRowsRendered}
                      width={width}
                      scrollTop={scrollTop}
                      height={height}
                      headerHeight={30}
                      rowHeight={250}
                      rowCount={showCount}
                      rowGetter={({ index }) => shows[index]}
                    >
                      <Column
                        label="№"
                        dataKey="index"
                        cellRenderer={renderIndexCell}
                        width={width * 0.05}
                      />
                      <Column
                        cellRenderer={renderImageCell}
                        label="img"
                        dataKey="image"
                        cellDataGetter={({ rowData }) => rowData.image}
                        width={width * 0.25}
                      />
                      <Column
                        label="Name"
                        dataKey="title"
                        width={width * 0.3}
                      />
                      <Column
                        label="Views Count"
                        dataKey="watched_allTime"
                        cellDataGetter={({ rowData }) =>
                          rowData.watched.allTime
                            .toString()
                            .replace(/\d(?=(?:\d{3})+$)/g, '$&,')
                        }
                        width={width * 0.2}
                      />
                      <Column
                        label="First Air Date"
                        dataKey="first_air_date"
                        cellDataGetter={({ rowData }) =>
                          rowData.additionalInfo.first_air_date
                        }
                        width={width * 0.2}
                      />
                    </Table>
                  )}
                </AutoSizer>
              )}
            </WindowScroller>
          )}
        </InfiniteLoader>
      </div>
    </div>
  );
};

TaskWrapper.propTypes = {
  shows: PropTypes.array.isRequired,
  showCount: PropTypes.number.isRequired,
};

TaskWrapper.displayName = 'TaskWrapper';

export default withTracker((props) => {
  const { loadPagination } = props.storeValue;
  Meteor.subscribe('tvShows', loadPagination);
  const sortMethod = props.storeValue.sort;

  return {
    shows: tvShows
      .find({}, { sort: { 'watched.allTime': sortMethod } })
      .fetch(),
    showCount: tvShows.find({}).count(),
  };
})(TaskWrapper);
