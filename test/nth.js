/* global describe, it */

var array = require('stream-array');
var assert = require('../index.js');
var should = require('should');

describe('assert.nth', function () {
	it('should check nth object', function (done) {
		array([1])
			.pipe(assert.nth(0, function (obj) { obj.should.eql(1); }))
			.pipe(assert.end(done));
	});

	it('should emit error on wrong nth object', function (done) {
		array([1, 2])
			.pipe(assert.nth(0, function (obj) { obj.should.eql(2); }))
			.pipe(assert.end(function (err) {
				should.exist(err);
				err.message.should.eql('0 position is not passing assertion: expected 1 to equal 2');
				done();
			}));
	});

	it('should have first shortcut', function (done) {
		array([1, 2, 3])
			.pipe(assert.first(function (obj) { obj.should.eql(1); }))
			.pipe(assert.end(done));
	});

	it('should have second shortcut', function (done) {
		array([1, 2, 3])
			.pipe(assert.second(function (obj) { obj.should.eql(2); }))
			.pipe(assert.end(done));
	});
});
