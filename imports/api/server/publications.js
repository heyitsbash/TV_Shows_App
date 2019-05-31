import { Meteor } from 'meteor/meteor';
import Tasks from '../collections/tasks.js';

Meteor.publish('tasks', (limit = 10) => {
  return Tasks.find({}, { limit });
});
