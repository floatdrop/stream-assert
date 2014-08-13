/* global describe, it */

var array = require('stream-array');
var assert = require('../index.js');
var should = require('should');

describe('assert.contains', function () {
	it('should assert stream contains element', function (done) {
		array([1])
			.pipe(assert.contains(1))
			.on('end', done);
	});

	it('should emit end with error when stream don\'t contains element', function (done) {
		array([1])
			.pipe(assert.contains(2))
			.on('end', function (err) {
				should.exist(err);
				done();
			});
	});
});
