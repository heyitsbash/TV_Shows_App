import { Meteor } from 'meteor/meteor';
import tvShows from '../collections/tvShows.js';

Meteor.publish('tvShows', (limit = 10) => {
  return tvShows.find({}, { limit });
});
