/* eslint-disable no-console */
import { Meteor } from 'meteor/meteor';
import axios from 'axios';
import TvShows from '../collections/TvShows.js';

const traktAPIKey = Meteor.settings.private.traktApiKey;
const tmdbAPIKey = Meteor.settings.private.tmdbApiKey;
let withoutImagesDB = [];
const brokenUrlTvShows = [];
let tmdbInterval = '';

const handleBadShows = () => {
  console.log(`handling ${brokenUrlTvShows.length} bad shows`);
  brokenUrlTvShows.forEach((element) => {
    TvShows.remove({ showId: element });
  });
  console.log('Done');
};

const addAdditionalInfoForShowsInMongoDB = ({ value }) => {
  TvShows.upsert(
    { showId: value.val.showId },
    {
      $set: {
        image: value.fetchFortyItems.backdrop_path,
        ...value.val,
        additionalInfo: { ...value.fetchFortyItems },
      },
    }
  );
};

const axiosTmdbCall = async (url, val) => {
  try {
    if (!url) {
      throw Error('bad url');
    }
    if (!val) {
      throw Error('bad val');
    }
    const fetchFortyItems = await axios({
      method: 'get',
      url,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!fetchFortyItems.data.first_air_date) {
      brokenUrlTvShows.push(val.showId);
    }
    const responseReturn = {
      type: 'response',
      value: {
        fetchFortyItems: fetchFortyItems.data,
        val,
      },
    };
    return responseReturn;
  } catch (error) {
    const errorMessage = {
      error,
      status: error.response.status,
      statusText: error.response.statusText,
      failedUrl: error.response.config.url,
      method: error.response.config.method,
      statusCode: error.response.data.status_code,
      statusMessage: error.response.data.status_message,
      showTitle: val.title,
      showId: val.showId,
    };
    brokenUrlTvShows.push(errorMessage.showId);
    const errorReturn = {
      type: 'error',
      errorMessage,
    };
    return errorReturn;
  }
};

const fetchAdditionalData = async () => {
  const fortyItems = withoutImagesDB.splice(0, 40);
  const imagesToFetch = withoutImagesDB.length;

  if (imagesToFetch) {
    console.log(`Items left to fetch: ${imagesToFetch}`);
  }
  if (!imagesToFetch) {
    console.log('stopping tmdbInterval interval');
    Meteor.clearInterval(tmdbInterval);
  }

  await Promise.all(
    fortyItems.map(async (val) => {
      const showId = val.idList.tmdb;
      if (!showId) {
        brokenUrlTvShows.push(val.showId);
        return;
      }
      const url = `https://api.themoviedb.org/3/tv/${showId}?api_key=${tmdbAPIKey}&language=en-US&append_to_response=images,videos&include_image_language=ru,null`;
      const axiosTmdbResponse = await axiosTmdbCall(url, val);
      if (axiosTmdbResponse.type === 'response') {
        await addAdditionalInfoForShowsInMongoDB(axiosTmdbResponse);
      }
    })
  );
  handleBadShows();
};

const initializeFetchingAdditionalTvShowData = async () => {
  try {
    withoutImagesDB = TvShows.find({ image: { $exists: false } }).fetch();
    console.log('Is there any images to fetch?');

    if (withoutImagesDB.length) {
      console.log('Yes');
      tmdbInterval = Meteor.setInterval(() => {
        fetchAdditionalData(withoutImagesDB);
      }, 12000);
    } else {
      console.log('No');
    }
  } catch (error) {
    console.log('TCL: anotherAxiosCall -> error', error);
  }
};

const axiosTraktCall = async (url) => {
  try {
    if (!url) {
      throw Error('bad url');
    }
    const traktDBWatched = await axios({
      method: 'get',
      url,
      headers: {
        'Content-Type': 'application/json',
        'trakt-api-version': 2,
        'trakt-api-key': traktAPIKey,
      },
    });
    const responseReturn = {
      type: 'response',
      value: traktDBWatched.data,
    };
    return responseReturn;
  } catch (error) {
    console.log('axiosTraktCall failed with error');
    const errorReturn = {
      type: 'error',
      error,
    };
    console.log(errorReturn);
    return errorReturn;
  }
};

const getDataFromAxiosAndPutItInArray = (axiosData) => {
  const array = [];
  axiosData.value.forEach((val) => {
    const item = {
      played: {
        allTime: val.play_count,
      },
      watched: {
        allTime: val.watcher_count,
      },
      title: val.show.title,
      showId: val.show.ids.trakt,
      idList: val.show.ids,
    };
    array.push(item);
  });
  return array;
};

const pushEachItemFromArrayIntoMongoDB = (arrayOfShows) => {
  arrayOfShows.forEach((val) => {
    TvShows.upsert(
      { showId: val.showId },
      {
        $set: {
          ...val,
        },
      }
    );
  });
};

const initializeTvShowFetching = async (url) => {
  const axiosData = await axiosTraktCall(url);
  if (axiosData.type === 'error') {
    console.log('Axios call has failed, exiting initializeTvShowFetching...');
    return;
  }
  const arrayOfShows = await getDataFromAxiosAndPutItInArray(axiosData);
  await pushEachItemFromArrayIntoMongoDB(arrayOfShows);
  initializeFetchingAdditionalTvShowData();
};

Meteor.setInterval(() => {
  initializeTvShowFetching(
    'https://api.trakt.tv/shows/watched/all?page=1&limit=3000'
  );
}, 86400000);

export { traktAPIKey, tmdbAPIKey, axiosTraktCall };
