/* global describe, it */

var intoStream = require('into-stream').obj;
var assert = require('../');
var should = require('should');
var is = require('funsert');

describe('assert.last', function () {
	it('should check last object', function (done) {
		intoStream([1, 2])
			.pipe(assert.last(is.equal(2)))
			.pipe(assert.end(done));
	});

	it('should emit end with error on wrong assertion', function (done) {
		intoStream([1])
			.pipe(assert.last(is.equal(2)))
			.pipe(assert.end(function (err) {
				should.exist(err);
				err.message.should.eql('Last element is not passing assertion: 1 is not equal 2');
				done();
			}));
	});
});
