/* global describe, it */

var array = require('stream-array');
var assert = require('../index.js');
var should = require('should');
var to = require('tobe');

describe('assert.any', function () {
	it('should find matching element in stream', function (done) {
		array([1, 2])
			.pipe(assert.any(to.be.eql(2)))
			.on('end', done);
	});

	it('should emit end with error on wrong assertion', function (done) {
		array([1])
			.pipe(assert.any(to.be.eql(2)))
			.on('end', function (err) {
				should.exist(err);
				done();
			});
	});
});
