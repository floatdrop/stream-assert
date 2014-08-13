var through = require('through2');
var deepEqual = require('deep-equal');

var assert = {};

assert.contains = function (expected) {
	var found = false;
	return through.obj(function (obj, enc, cb) {
		if (deepEqual(obj, expected)) {
			found = true;
		}
		cb(null, obj);
	}).on('finish', function () {
		if (!found) {
			this.emit('end', new Error(
				'Object ' + expected + ' was not found in stream'
			));
		} else {
			this.emit('end');
		}
	});
};


assert.length = function (expected) {
	var i = 0;
	return through.obj(function (obj, enc, cb) {
		i++;
		cb(null, obj);
	}).on('finish', function () {
		if (i !== expected) {
			this.emit('end', new Error(
				'Expected stream length is ' + expected + ', but got ' + i
			));
		} else {
			this.emit('end');
		}
	});
};

module.exports = assert;
