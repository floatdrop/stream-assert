/* global describe, it */

var intoStream = require('into-stream').obj;
var assert = require('../');
var should = require('should');
var is = require('funsert');

describe('assert.nth', function () {
	it('should check nth object', function (done) {
		intoStream([1])
			.pipe(assert.nth(0, is.equal(1)))
			.pipe(assert.end(done));
	});

	it('should emit error on wrong nth object', function (done) {
		intoStream([1, 2])
			.pipe(assert.nth(0, is.equal(2)))
			.pipe(assert.end(function (err) {
				should.exist(err);
				err.message.should.eql('0 position is not passing assertion: 1 is not equal 2');
				done();
			}));
	});

	it('should have first shortcut', function (done) {
		intoStream([1, 2, 3])
			.pipe(assert.first(is.equal(1)))
			.pipe(assert.end(done));
	});

	it('should have second shortcut', function (done) {
		intoStream([1, 2, 3])
			.pipe(assert.second(is.equal(2)))
			.pipe(assert.end(done));
	});
});
