import React, { useState, useEffect } from 'react';
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
import ModalWindow from './ModalWindow.jsx';
import sortAction from '../redux/actions/sortAction.js';
import loadPaginationAction from '../redux/actions/loadPaginationAction.js';
import isFetchingAction from '../redux/actions/isFetchingAction.js';
import searchFieldAction from '../redux/actions/searchFieldAction.js';
import sortMethodAction from '../redux/actions/sortMethodAction.js';
import TvShows from '../api/collections/TvShows.js';

const TaskWrapper = ({ shows, pageShowCount }) => {
  const isFetching = useSelector((value) => value.isFetching);
  const dispatch = useDispatch();
  const sortingAction = () => dispatch(sortAction());
  const isFetchingDispatch = (bool) => dispatch(isFetchingAction(bool));
  const sortMethodDispatch = (string) => dispatch(sortMethodAction(string));
  const searchFieldDispatch = (string) => dispatch(searchFieldAction(string));
  const paginationLoad = (pages) => dispatch(loadPaginationAction(pages));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalProps, setModalProps] = useState({});
  const [inputVal, setInputVal] = useState('');

  const openModal = () => {
    setIsModalOpen(true);
  };

  const outsideClickCloseModal = (e) => {
    const modalOverlay = document.querySelector('.modalOverlay');
    if (e.target === modalOverlay) {
      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener('click', outsideClickCloseModal);
    return () => {
      window.removeEventListener('click', outsideClickCloseModal);
    };
  }, [isModalOpen]);

  const handleInputChange = () => {
    searchFieldDispatch(inputVal);
  };

  // loads more shows to the page, isFetchingDispatch limits calls to once per second
  // paginationLoad takes number how many more pages to load
  const loadMorePages = () => {
    if (isFetching || isModalOpen) {
      return;
    }
    isFetchingDispatch(true);
    paginationLoad(15);
    Meteor.setTimeout(() => {
      isFetchingDispatch(false);
    }, 1000);
  };

  const showModal = (cellData) => {
    setModalProps(cellData);
    openModal();
  };

  const renderModalCell = (cellData) => {
    return (
      <button
        type="button"
        style={{ cursor: 'pointer' }}
        onClick={() => showModal(cellData)}
      >
        info
      </button>
    );
  };

  const renderImageCell = ({ cellData }) => {
    let image;
    if (!cellData) {
      image = `https://i.imgur.com/6GAi5oP.png`;
    } else {
      image = `https://image.tmdb.org/t/p/w780${cellData}`;
    }
    return (
      <div className="tableImg" style={{ backgroundImage: `url(${image})` }} />
    );
  };

  const renderIndexCell = ({ rowIndex }) => {
    const index = rowIndex + 1;
    return index;
  };

  const onHeaderClick = ({ dataKey }) => {
    switch (dataKey) {
      case 'first_air_date':
        sortMethodDispatch('additionalInfo.first_air_date');
        sortingAction();
        break;
      case 'title':
        sortMethodDispatch('title');
        sortingAction();
        break;
      case 'played_allTime':
        sortMethodDispatch('played.allTime');
        sortingAction();
        break;
      default:
        break;
    }
  };

  showModal.displayName = 'showModal';
  renderModalCell.displayName = 'renderModalCell';
  renderImageCell.displayName = 'renderImageCell';
  renderImageCell.propTypes = {
    cellData: PropTypes.string.isRequired,
  };

  return (
    <div className="container">
      {isModalOpen && <ModalWindow props={modalProps} />}
      <div className="tableHeader">
        <span className="counter">{pageShowCount}</span>
        <form
          style={{ width: '50%', height: '45px' }}
          onKeyUp={handleInputChange}
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            className="inputField"
            type="text"
            placeholder="search by name"
            value={inputVal}
            onChange={(el) => setInputVal(el.target.value)}
          />
        </form>
        <span className="tvShows">TV-Shows</span>
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
                      onHeaderClick={onHeaderClick}
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
                        label="Views"
                        dataKey="played_allTime"
                        cellDataGetter={({ rowData }) =>
                          rowData.played.allTime
                            .toString()
                            .replace(/\d(?=(?:\d{3})+$)/g, '$&,')
                        }
                        width={width * 0.2}
                      />
                      <Column
                        label="Air Date"
                        dataKey="first_air_date"
                        cellDataGetter={({ rowData }) => {
                          if (rowData.additionalInfo.first_air_date) {
                            return new Date(
                              ...rowData.additionalInfo.first_air_date.split(
                                '-'
                              )
                            ).toLocaleString('en-us', {
                              year: 'numeric',
                              month: 'short',
                            });
                          }
                          return '';
                        }}
                        width={width * 0.1}
                      />
                      <Column
                        cellRenderer={renderModalCell}
                        label="info"
                        dataKey="loadModal"
                        cellDataGetter={({ rowData }) => rowData}
                        width={width * 0.1}
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
  const searchField = props.storeValue.searchField.trim();
  const sortValue = props.storeValue.sortMethod;
  const sortOrder = props.storeValue.sort;
  const sortMethod = {};
  sortMethod[sortValue] = sortOrder;
  const filter = { title: { $regex: searchField, $options: 'i' } };
  const dbPayload = {
    limit: loadPagination,
    sortMethod,
    filter,
  };
  Meteor.subscribe('TvShows', dbPayload);
  if (searchField !== '') {
    return {
      shows: TvShows.find({}, { sort: sortMethod }).fetch(),
      pageShowCount: TvShows.find({}).count(),
    };
  }
  return {
    shows: TvShows.find({}).fetch(),
    pageShowCount: TvShows.find({}).count(),
  };
})(TaskWrapper);
