var through = require('through2');
var deepEqual = require('deep-equal');
var inspect = require('util').inspect;

var assert = {};

assert.nth = function (n, expected) {
	var i = 0;
	return through.obj(function (obj, enc, cb) {
		if (i === n && !deepEqual(obj, expected)) {
			this.emit('end',
				'Expected to see ' + inspect(expected) +
				' on ' + n + ' position, but got ' + inspect(obj));
			this.emit('close');
		}
		i++;
		cb(null, obj);
	}).on('finish', function () {
		this.emit('end');
	});
};

assert.first = function (expected) {
	return assert.nth(0, expected);
};

assert.second = function (expected) {
	return assert.nth(1, expected);
};

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
				'Object ' + inspect(expected) +
				' was not found in stream'
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
				'Expected stream length is ' + inspect(expected) +
				', but got ' + i
			));
		} else {
			this.emit('end');
		}
	});
};

module.exports = assert;
