/* global describe, it */

var array = require('stream-array');
var assert = require('../index.js');
var should = require('should');

describe('assert.end', function () {
	it('should help dump long streams', function (done) {
		var long = [];
		for (var i = 0; i < 100; i++) { long.push(i); }
		array(long)
			.pipe(assert.end(done));
	});

	it('should invoke callback with error', function (done) {
		var long = [];
		for (var i = 0; i < 100; i++) { long.push(i); }
		array(long)
			.pipe(assert.length(1))
			.pipe(assert.end(function (err) {
				should.exist(err);
				done();
			}));
	});
});
