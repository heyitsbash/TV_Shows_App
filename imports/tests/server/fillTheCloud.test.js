import expect from 'expect';
import { traktAPIKey, tmdbAPIKey } from '../../api/server/fillTheCloud.js';

describe('fillTheCloud', function () {
	it('trakt key should be a string', function () {
		typeof traktAPIKey === 'string'
	});
	it('tmdb key should be a string', function () {
		typeof traktAPIKey === 'string'
	});
});