if (Meteor.isClient) {
	import './client/index.test.js';
}

if (Meteor.isServer) {
	import './server/index.test.js';
}