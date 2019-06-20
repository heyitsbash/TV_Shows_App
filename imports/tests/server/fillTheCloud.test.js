import expect from 'expect';
import { traktAPIKey, tmdbAPIKey, axiosCall } from '../../api/server/fillTheCloud.js';

describe('fillTheCloud', () => {
	it('trakt key should be a string', () => {
		expect(typeof traktAPIKey === 'string').toBeTruthy();
	});
	it('tmdb key should be a string', () => {
		expect(typeof tmdbAPIKey === 'string').toBeTruthy();
	});
});
