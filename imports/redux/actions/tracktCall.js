/* eslint-disable no-console */
import { Meteor } from 'meteor/meteor';

export default (url) => {
  return () => {
    Meteor.call('callTraktAPI', url, (error, { data }) => {
      if (error) {
        console.log('this is erorr');
        console.log(error);
      } else {
        // console.log(data);
        const array = [];
        data.forEach((val) => {
          const item = {
            played: val.play_count,
            watched: val.watcher_count,
            title: val.show.title,
            id: val.show.ids.trakt,
            idList: val.show.ids,
          };
          array.push(item);
        });
        console.log('value of array is: ');
        console.log(array);
      }
    });
  };
};
