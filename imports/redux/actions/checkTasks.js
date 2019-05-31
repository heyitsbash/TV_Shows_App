import { Meteor } from 'meteor/meteor';

export default (task) => {
  return () => {
    Meteor.call('tasksSetChecked', task._id, !task.checked);
  };
};
