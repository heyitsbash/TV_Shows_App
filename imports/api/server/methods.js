import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import axios from 'axios';
import tvShows from '../collections/tvShows.js';

const traktAPIKey = Meteor.settings.private.traktApiKey;

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
});
