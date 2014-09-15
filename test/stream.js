/* global describe, it */

var assert = require('../assertStream');
var should = require('should');

describe('assert.stream', function () {
	it('should pass assertion event to next stream in pipeline', function (done) {
		var s1 = assert();
		var s2 = assert();

		s1.pipe(s2).on('assertion', function (error) {
			should.exist(error);
			done();
		});

		s1.emit('assertion', new Error('Bang!'));
	});

	it('should emit end with error only once', function (done) {
		var s1 = assert(function (obj, enc, cb) {
			if (obj === 2) {
				this.assertion('Bang!');
			} else {
				cb(null, obj);
			}
		});
		var s2 = assert();

		s1.pipe(s2).on('assertion', function (error) {
			should.exist(error);
			done();
		});

		s1.end(2);
	});
});
