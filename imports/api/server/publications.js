/* eslint-disable prettier/prettier */
import { Meteor } from 'meteor/meteor';
import Tasks from '../tasks';

Meteor.publish('tasks', function tasksPublication (limit = 10) {
  return Tasks.find({}, {limit});
});
