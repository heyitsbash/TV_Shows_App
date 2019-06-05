import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import axios from 'axios';
import tvShows from '../collections/tvShows.js';

const traktAPIKey = Meteor.settings.private.traktApiKey;
const tmdbAPIKey = Meteor.settings.private.tmdbApiKey;

Meteor.methods({
  tasksInsert: (text) => {
    check(text, String);

    return tvShows.insert({
      text,
      createdAt: new Date(),
    });
  },
  tasksRemove: (id) => {
    check(id, String);
    return tvShows.remove(id);
  },
  tasksSetChecked: (id, setChecked) => {
    check(id, String);
    check(setChecked, Boolean);
    return tvShows.update(id, { $set: { checked: setChecked } });
  },
  callTraktAPI: (url) => {
    return axios({
      method: 'get',
      url,
      headers: {
        'Content-Type': 'application/json',
        'trakt-api-version': 2,
        'trakt-api-key': traktAPIKey,
      },
    })
      .then((data) => {
        const response = data.data;
        const successResponse = {
          type: 'success',
          data: response,
        };
        return successResponse;
      })
      .catch((error) => {
        const errorResponse = {
          type: 'error',
          data: error,
        };
        // return errorResponse;
        throw new Error(errorResponse);
      });
  },
  callTmdbAPI: (tvShowId) => {
    const url = `https://api.themoviedb.org/3/tv/${tvShowId}?api_key=${tmdbAPIKey}&language=en-US&append_to_response=images,videos&include_image_language=ru,null`;
    return axios({
      method: 'get',
      url,
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((data) => {
        const response = data.data;
        const successResponse = {
          type: 'success',
          data: response,
        };
        return successResponse;
      })
      .catch((error) => {
        const errorResponse = {
          type: 'error',
          data: error,
        };
        // return errorResponse;
        throw new Error(errorResponse);
      });
  },
});
