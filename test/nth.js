/* global describe, it */

var array = require('stream-array');
var assert = require('../index.js');
var should = require('should');
var to = require('tobe');

describe('assert.nth', function () {
	it('should check nth object', function (done) {
		array([1])
			.pipe(assert.nth(0, to.be.eql(1)))
			.on('end', done);
	});

	it('should emit error on wrong nth object', function (done) {
		array([1, 2])
			.pipe(assert.nth(0, to.be.eql(2)))
			.on('end', function (err) {
				should.exist(err);
				done();
			});
	});

	it('should have first shortcut', function (done) {
		array([1])
			.pipe(assert.first(to.be.eql(1)))
			.on('end', done);
	});

	it('should have second shortcut', function (done) {
		array([1, 2])
			.pipe(assert.second(to.be.eql(2)))
			.on('end', done);
	});
});
