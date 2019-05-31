import { Meteor } from 'meteor/meteor';

export default (text) => {
  return () => {
    Meteor.call('tasksInsert', text);
  };
};
