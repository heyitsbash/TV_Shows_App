/* eslint-disable no-console */
import { Meteor } from 'meteor/meteor';
import axios from 'axios';
import tvShows from '../collections/tvShows.js';

const traktAPIKey = Meteor.settings.private.traktApiKey;
const tmdbAPIKey = Meteor.settings.private.tmdbApiKey;
let withoutImagesDB = [];
let tmdbInterval = '';

const fetchAdditionalData = async () => {
  const fortyItems = withoutImagesDB.splice(0, 40);
  const imagesToFetch = withoutImagesDB.length;
  const brokenUrlTvShows = [];

  if (imagesToFetch) {
    console.log(`Items left to fetch: ${imagesToFetch}`);
  } else {
    console.log('Done fetching images');
  }

  const handleBadShows = () => {
    console.log(`handling ${brokenUrlTvShows.length} bad shows`);
    brokenUrlTvShows.forEach((element) => {
      tvShows.remove({ showId: element });
    });
    console.log('Done');
  };

  if (!imagesToFetch) {
    Meteor.clearInterval(tmdbInterval);
  }

  const makeCall = async (url, val) => {
    try {
      const fetchFortyItems = await axios({
        method: 'get',
        url,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      tvShows.upsert(
        { showId: val.showId },
        {
          $set: {
            image: fetchFortyItems.data.backdrop_path,
            ...val,
            additionalInfo: { ...fetchFortyItems.data },
          },
        }
      );
    } catch (error) {
      const errorMessage = {
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
      // console.log(errorMessage);
    }
  };

  await Promise.all(
    fortyItems.map(async (val) => {
      const showId = val.idList.tmdb;
      if (!showId) {
        brokenUrlTvShows.push(val.showId);
        return;
      }
      const url = `https://api.themoviedb.org/3/tv/${showId}?api_key=${tmdbAPIKey}&language=en-US&append_to_response=images,videos&include_image_language=ru,null`;
      await makeCall(url, val);
    })
  );
  handleBadShows();
};

const anotherAxiosCall = async () => {
  try {
    withoutImagesDB = tvShows.find({ image: { $exists: false } }).fetch();
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

const axiosCall = async (url) => {
  try {
    const traktDBWatched = await axios({
      method: 'get',
      url,
      headers: {
        'Content-Type': 'application/json',
        'trakt-api-version': 2,
        'trakt-api-key': traktAPIKey,
      },
    });
    console.log('response log');

    const array = [];
    traktDBWatched.data.forEach((val) => {
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

    array.forEach((val) => {
      tvShows.upsert(
        { showId: val.showId },
        {
          $set: {
            ...val,
          },
        }
      );
    });
    anotherAxiosCall();
  } catch (error) {
    console.error('error log');
    console.error(error);
  }
};

Meteor.setInterval(() => {
  axiosCall('https://api.trakt.tv/shows/watched/all?page=1&limit=10000');
}, 86400000);
