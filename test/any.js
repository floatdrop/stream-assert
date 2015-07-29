/* global describe, it */

var intoStream = require('into-stream').obj;
var assert = require('../');
var should = require('should');
var is = require('funsert');

describe('assert.any', function () {
	it('should find matching element in stream', function (done) {
		intoStream([1, 2])
			.pipe(assert.any(is.equal(2)))
			.pipe(assert.end(done));
	});

	it('should emit end with error on wrong assertion', function (done) {
		intoStream([1])
			.pipe(assert.any(is.equal(2)))
			.pipe(assert.end(function (err) {
				should.exist(err);
				err.message.should.eql('Nothing passing assertion');
				done();
			}));
	});
});
