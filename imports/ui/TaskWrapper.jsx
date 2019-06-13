import React from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { useDispatch, useSelector } from 'react-redux';
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
import isFetchingAction from '../redux/actions/isFetchingAction.js';
import TvShows from '../api/collections/TvShows.js';

const TaskWrapper = ({ shows, pageShowCount }) => {
  const isFetching = useSelector((value) => value.isFetching);
  const dispatch = useDispatch();
  const sortingAction = () => dispatch(sortAction());
  const isFetchingDispatch = (bool) => dispatch(isFetchingAction(bool));
  const callingTrakt = (url) => dispatch(callTrakt(url));
  const paginationLoad = (pages) => dispatch(loadPaginationAction(pages));
  const totalAmountOfShows = Meteor.settings.public.totalShowCount;

  const changeListOrder = () => {
    sortingAction();
  };

  const testAPIcall = () => {
    callingTrakt('https://api.trakt.tv/shows/464?extended=full');
  };

  // loads more shows to the page, isFetchingDispatch limits calls to once per second
  // pagination load takes number how many more pages to load
  const loadMorePages = () => {
    if (isFetching) {
      return;
    }
    isFetchingDispatch(true);
    paginationLoad(15);
    Meteor.setTimeout(() => {
      dispatch(isFetchingDispatch(false));
    }, 1000);
  };

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
  renderImageCell.propTypes = {
    cellData: PropTypes.string.isRequired,
  };

  return (
    <div className="container">
      <div className="tableHeader">
        <span>
          Currently loaded - {pageShowCount} / {totalAmountOfShows}
        </span>
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
          loadMoreRows={isFetching ? () => {} : loadMorePages}
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
                      headerHeight={35}
                      rowHeight={250}
                      rowCount={pageShowCount}
                      rowGetter={({ index }) => shows[index]}
                    >
                      <Column
                        label="№"
                        dataKey="index"
                        style={{ fontSize: '20px' }}
                        cellRenderer={renderIndexCell}
                        width={width * 0.1 + 28}
                      />
                      <Column
                        cellRenderer={renderImageCell}
                        label="poster"
                        dataKey="image"
                        cellDataGetter={({ rowData }) => rowData.image}
                        width={width * 0.2 - 28}
                      />
                      <Column
                        label="show"
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
  pageShowCount: PropTypes.number.isRequired,
};

TaskWrapper.displayName = 'TaskWrapper';

export default withTracker((props) => {
  const { loadPagination } = props.storeValue;
  const sortOrder = props.storeValue.sort;
  const sortMethod = { 'watched.allTime': sortOrder };
  const dbPayload = {
    limit: loadPagination,
    sortMethod,
  };
  Meteor.subscribe('TvShows', dbPayload);

  return {
    shows: TvShows.find({}).fetch(),
    pageShowCount: TvShows.find({}).count(),
  };
})(TaskWrapper);
