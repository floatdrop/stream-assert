/* global describe, it */

var array = require('stream-array');
var assert = require('../index.js');

describe('assert.end', function () {
	it('should help dump long streams', function (done) {
		var long = [];
		for (var i = 0; i < 100; i++) { long.push(i); }
		array(long)
			.pipe(assert.length(long.length))
			.pipe(assert.end(done));
	});

	it('should emit end', function (done) {
		var long = [];
		for (var i = 0; i < 100; i++) { long.push(i); }
		array(long)
			.pipe(assert.length(long.length))
			.pipe(assert.end())
			.on('end', done);
	});
});
