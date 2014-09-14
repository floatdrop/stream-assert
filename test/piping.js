/* global describe, it */

var array = require('stream-array');
var assert = require('../index.js');
var should = require('should');
describe('assert piping', function () {
	it('should fail with first assertion', function (done) {
		array([1, 2])
			.pipe(assert.length(1))
			.pipe(assert.length(2))
			.on('end', function (err) {
				should.exist(err);
				err.message.should.eql('Stream length 2 not equal 1');
				done();
			});
	});

	it('should fail with second assertion', function (done) {
		array([1, 2])
			.pipe(assert.length(2))
			.pipe(assert.length(1))
			.on('end', function (err) {
				should.exist(err);
				err.message.should.eql('Stream length 2 not equal 1');
				done();
			});
	});
});
