import { Meteor } from 'meteor/meteor';

export default (task) => {
  return () => {
    Meteor.call('tasksRemove', task._id);
  };
};
