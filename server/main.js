/* eslint-disable prettier/prettier */
import { Meteor } from 'meteor/meteor';
// import Links from '../imports/api/links';
// import Tasks from '../imports/api/tasks';
import '../imports/api/server/methods';
import '../imports/api/server/publications';

// function insertLink (title, url) {
//   Links.insert({ title, url, createdAt: new Date() });
// }



Meteor.startup(() => {
  // If the Links collection is empty, add some data.
  // if (Links.find()
  //   .count() === 0) {
  //   insertLink(
  //     'Do the Tutorial',
  //     'https://www.meteor.com/tutorials/react/creating-an-app'
  //   );

  //   insertLink('Follow the Guide', 'http://guide.meteor.com');

  //   insertLink('Read the Docs', 'https://docs.meteor.com');

  //   insertLink('Discussions', 'https://forums.meteor.com');
  // }
});
