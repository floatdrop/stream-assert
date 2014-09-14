/* global describe, it */

var array = require('stream-array');
var assert = require('../index.js');
var should = require('should');
describe.skip('assert watermark', function () {
	it('should not be a problem', function (done) {
		var a = [];
		for (var i = 0; i < 100; i++) { a.push(i); }
		array(a)
			.pipe(assert.length(a.length))
			.on('end', function (err) {
				should.not.exist(err);
				done();
			});
	});
});
