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
// import 'react-virtualized/styles.css';

const TaskWrapper = ({ shows, incompleteCount }) => {
  const dispatch = useDispatch();
  const sortingAction = () => dispatch(sortAction());
  const callingTrakt = (url) => dispatch(callTrakt(url));
  const paginationLoad = (pages) => dispatch(loadPaginationAction(pages));

  const lust = shows.map((show, index) => {
    return {
      index: index + 1,
      name: show.title,
      description: show.watched.allTime,
      airDate: show.additionalInfo.first_air_date,
      img: `https://image.tmdb.org/t/p/w780${show.image}`,
    };
  });

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
    return <img src={cellData} alt="" height="250px" />;
  };

  const renderIndexCell = ({ rowIndex }) => {
    const index = rowIndex + 1;
    return index;
  };

  renderImageCell.displayName = 'renderImageCell';

  return (
    <div className="container">
      <header>
        <h1>TV Shows - {incompleteCount}</h1>
        <button type="button" onClick={changeListOrder}>
          Order
        </button>
        <button type="button" onClick={testAPIcall}>
          Test API
        </button>
        <button type="button" onClick={loadMorePages}>
          Load More
        </button>
      </header>
      <div>
        <InfiniteLoader
          isRowLoaded={({ index }) => !!lust[index]}
          loadMoreRows={loadMorePages}
          rowCount={100000000}
        >
          {({ onRowsRendered, registerChild }) => (
            <WindowScroller>
              {({ height, scrollTop }) => (
                <AutoSizer disableHeight>
                  {({ width }) => (
                    <Table
                      ref={registerChild}
                      onRowsRendered={onRowsRendered}
                      autoHeight
                      headerStyle={{
                        display: 'flex',
                      }}
                      rowStyle={{
                        display: 'flex',
                      }}
                      width={width}
                      scrollTop={scrollTop}
                      height={height}
                      headerHeight={30}
                      rowHeight={250}
                      rowCount={lust.length}
                      rowGetter={({ index }) => lust[index]}
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
                        dataKey="img"
                        width={width * 0.25}
                      />
                      <Column label="Name" dataKey="name" width={width * 0.3} />
                      <Column
                        label="Views Count"
                        dataKey="description"
                        width={width * 0.2}
                      />
                      <Column
                        label="First Air Date"
                        dataKey="airDate"
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
  incompleteCount: PropTypes.number.isRequired,
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
    incompleteCount: tvShows.find({ checked: { $ne: true } }).count(),
  };
})(TaskWrapper);
