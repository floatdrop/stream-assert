/* global describe, it */

var array = require('stream-array');
var assert = require('../index.js');
var should = require('should');

describe('assert.nth', function () {
	it('should check first object', function (done) {
		array([1])
			.pipe(assert.nth(0, 1))
			.on('end', done);
	});

	it('should check second object', function (done) {
		array([1, 2])
			.pipe(assert.nth(1, 2))
			.on('end', done);
	});

	it('should emit end with error on wrong assertion', function (done) {
		array([1])
			.pipe(assert.first(2))
			.on('end', function (err) {
				should.exist(err);
				done();
			});
	});
});
