/* eslint-disable prettier/prettier */
import { Meteor } from 'meteor/meteor';

export default function tasksRemove (task) {
  return () => {
    Meteor.call('tasksRemove', task._id);
  };
}
