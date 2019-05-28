/* eslint-disable no-console */
/* eslint-disable prettier/prettier */
import { Meteor } from 'meteor/meteor';

export default function callTraktAPI (url) {
  return () => {
    Meteor.call('callTraktAPI', url, (error, data) => {

      if (error) {
        console.log("this is erorr");
        console.log(error);
      } else {
        console.log(data);
      }
    });
  };
}
