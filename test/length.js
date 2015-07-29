/* global describe, it */

var intoStream = require('into-stream').obj;
var assert = require('../');
var should = require('should');
var is = require('funsert');

describe('assert.length', function () {
	it('should validate stream length', function (done) {
		intoStream([1])
			.pipe(assert.length(1))
			.pipe(assert.end(done));
	});

	it('should emit end with error on wrong assertion', function (done) {
		intoStream([1])
			.pipe(assert.length(2))
			.pipe(assert.end(function (err) {
				should.exist(err);
				err.message.should.eql('Expected length 2 is not equal 1');
				done();
			}));
	});

	it('should accept function as assertion', function (done) {
		intoStream([1])
			.pipe(assert.length(is.equal(1)))
			.pipe(assert.end(done));
	});
});
