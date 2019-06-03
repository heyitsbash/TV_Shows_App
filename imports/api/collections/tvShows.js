import { Mongo } from 'meteor/mongo';

const tvShows = new Mongo.Collection('tvShows');
export default tvShows;
