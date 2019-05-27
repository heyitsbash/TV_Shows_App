/* eslint-disable prettier/prettier */
import { Meteor } from 'meteor/meteor';

export default function tasksInsert (text) {
  return () => {
    Meteor.call('tasksInsert', text);
  };
}
