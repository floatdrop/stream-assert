/* global describe, it */

var intoStream = require('into-stream').obj;
var assert = require('../');
var should = require('should');
var is = require('funsert');

describe('assert piping', function () {
	it('should fail with first assertion', function (done) {
		intoStream([1, 2])
			.pipe(assert.length(1))
			.pipe(assert.length(2))
			.pipe(assert.end(function (err) {
				should.exist(err);
				err.message.should.eql('Expected length 1 is not equal 2');
				done();
			}));
	});

	it('should fail with second assertion', function (done) {
		intoStream([1, 2])
			.pipe(assert.length(2))
			.pipe(assert.length(1))
			.pipe(assert.end(function (err) {
				should.exist(err);
				err.message.should.eql('Expected length 1 is not equal 2');
				done();
			}));
	});

	it('should support piping after all', function (done) {
		intoStream([1, 1, 1])
			.pipe(assert.all(is.equal(1)))
			.pipe(assert.length(3))
			.pipe(assert.end(function (err) {
				should.not.exist(err);
				done();
			}));
	});
});
