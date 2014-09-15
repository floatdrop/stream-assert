/* global describe, it */

var array = require('stream-array');
var assert = require('../index.js');
var should = require('should');
var to = require('tobe');

describe('assert.last', function () {
	it('should check last object', function (done) {
		array([1, 2])
			.pipe(assert.last(to.be.eql(2)))
			.on('end', done);
	});

	it('should emit end with error on wrong assertion', function (done) {
		array([1])
			.pipe(assert.last(function (obj) { obj.should.eql(2); }))
			.on('end', function (err) {
				should.exist(err);
				err.message.should.eql('Last element is not passing assertion: expected 1 to equal 2');
				done();
			});
	});
});
