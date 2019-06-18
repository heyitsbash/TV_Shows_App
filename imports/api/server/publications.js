import { Meteor } from 'meteor/meteor';
// import TvShows from '../collections/TvShows.js';
import TvShows from '../../../../../imports/api/collections/TvShows.js';
import { writeToSettings, getSettingsFile } from './writeToSettings.js';

const allShows = JSON.stringify(TvShows.find({}).count());
const settingsFile = getSettingsFile();
settingsFile.public.totalShowCount = allShows;
writeToSettings(settingsFile);

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
