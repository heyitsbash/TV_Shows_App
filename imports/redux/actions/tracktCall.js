/* eslint-disable no-console */
import { Meteor } from 'meteor/meteor';

export default (url) => {
  return () => {
    Meteor.call('callTraktAPI', url, (error, { data }) => {
      if (error) {
        console.log('this is erorr');
        console.log(error);
      } else {
        console.log(data);
      }
    });
  };
};
