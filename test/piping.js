/* global describe, it */

var array = require('stream-array');
var assert = require('../index.js');
var should = require('should');
describe('assert piping', function () {
	it('should fail with first assertion', function (done) {
		array([1, 2])
			.pipe(assert.length(1))
			.pipe(assert.length(2))
			.pipe(assert.end(function (err) {
				should.exist(err);
				err.message.should.eql('Expected length 1 is not equal 2');
				done();
			}));
	});

	it('should fail with second assertion', function (done) {
		array([1, 2])
			.pipe(assert.length(2))
			.pipe(assert.length(1))
			.pipe(assert.end(function (err) {
				should.exist(err);
				err.message.should.eql('Expected length 1 is not equal 2');
				done();
			}));
	});

	it('should support piping after all', function (done) {
		array([1, 1, 1])
			.pipe(assert.all(function (obj) { obj.should.eql(1); } ))
			.pipe(assert.length(3))
			.pipe(assert.end(function (err) {
				should.not.exist(err);
				done();
			}));
	});
});
