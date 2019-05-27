/* eslint-disable prettier/prettier */
import { Meteor } from 'meteor/meteor';

export default function tasksSetChecked (task) {
  return () => {
    Meteor.call('tasksSetChecked', task._id, !task.checked);
  };
}
