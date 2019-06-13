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
  let options = {
    limit,
    sort: {},
  };
  options.sort = {};
  options = { ...options, limit, sort: sortMethod };

  return TvShows.find({}, options);
});
