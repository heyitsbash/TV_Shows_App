import { Meteor } from 'meteor/meteor';
import FS from 'fs';
import TvShows from '../collections/TvShows.js';

const settingsFile = JSON.parse(
  FS.readFileSync('../../../../../settings.json')
);
const allShows = TvShows.find({}).count();
settingsFile.public.totalShowCount = allShows;

const writeToSettings = () => {
  const updateSettingsFile = JSON.stringify(settingsFile, null, 2);
  FS.writeFile('../../../../../settings.json', updateSettingsFile, () => {
    // console.log(`Updated settings file..`);
  });
};

writeToSettings();

Meteor.publish('TvShows', (payload) => {
  const { sortMethod } = payload;
  const { limit } = payload;
  const { filter } = payload;
  const options = {
    limit,
    sort: sortMethod,
  };
  if (filter.title.$regex === '') {
    return TvShows.find({}, options);
  }
  return TvShows.find(filter, { limit: options.limit });
});
