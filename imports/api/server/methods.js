/* eslint-disable prettier/prettier */
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Tasks from '../tasks';

Meteor.methods({
  tasksInsert (text) {
    check(text, String);

    return Tasks.insert({
      text,
      createdAt: new Date(),
    });
  },
  tasksRemove (id) {
    check(id, String);
    return Tasks.remove(id);
  },
  tasksSetChecked (id, setChecked) {
    check(id, String);
    check(setChecked, Boolean);
    return Tasks.update(id, { $set: { checked: setChecked } });
  },
});
