/* global describe, it */

var array = require('stream-array');
var assert = require('../index.js');
var should = require('should');

describe('assert.all', function () {
	it('should check all elements in stream', function (done) {
		array([1, 1])
			.pipe(assert.all(function(data) { data.should.eql(1); }))
			.on('end', done);
	});

	it('should emit end with error on wrong assertion', function (done) {
		array([1, 2])
			.pipe(assert.all(function(data) { data.should.eql(1); }))
			.on('end', function (err) {
				should.exist(err);
				done();
			});
	});
});
