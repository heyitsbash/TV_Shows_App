/* eslint-disable no-console */
import { Meteor } from 'meteor/meteor';
import axios from 'axios';
import tvShows from '../collections/tvShows.js';

const traktAPIKey = Meteor.settings.private.traktApiKey;
const tmdbAPIKey = Meteor.settings.private.tmdbApiKey;
let withoutImagesDB = [];
let tmdbInterval = '';

const fetchAdditionalData = () => {
  const fortyItems = withoutImagesDB.splice(0, 40);
  if (!withoutImagesDB.length) {
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
      console.log(error);
    }
  };
  fortyItems.forEach((val) => {
    const showId = val.idList.tmdb;
    const url = `https://api.themoviedb.org/3/tv/${showId}?api_key=${tmdbAPIKey}&language=en-US&append_to_response=images,videos&include_image_language=ru,null`;
    makeCall(url, val);
  });
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

Meteor.setTimeout(() => {
  axiosCall('https://api.trakt.tv/shows/watched/all?page=1&limit=150');
}, 3000);

Meteor.setInterval(() => {
  axiosCall('https://api.trakt.tv/shows/watched/all?page=1&limit=150');
}, 86400000);
