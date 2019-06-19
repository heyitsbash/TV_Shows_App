import { Meteor } from 'meteor/meteor';
import TvShows from '../collections/TvShows.js';

Meteor.publish('TvShows', (payload) => {
  const { sortMethod, limit, filter } = payload;
  const options = {
    limit,
    sort: sortMethod,
  };
  if (filter.title.$regex === '') {
    return TvShows.find({}, options);
  }
  return TvShows.find(filter, { limit: options.limit });
});
