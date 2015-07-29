/* global describe, it */

var intoStream = require('into-stream').obj;
var assert = require('../');
var should = require('should');
var is = require('funsert');

describe('assert.all', function () {
	it('should check all elements in stream', function (done) {
		intoStream([1, 1])
			.pipe(assert.all(is.equal(1)))
			.pipe(assert.end(done));
	});

	it('should emit end with error on wrong assertion', function (done) {
		intoStream([1, 2])
			.pipe(assert.all(is.equal(1)))
			.pipe(assert.end(function (err) {
				should.exist(err);
				err.message.should.eql('Element on 1 position is not passing assertion: 2 is not equal 1');
				done();
			}));
	});
});
