var through = require('through2');

var assert = {};

assert.nth = function (n, assertion) {
	var i = 0;
	return through.obj(function (obj, enc, cb) {
		if (i === n) {
			try {
				assertion(obj);
			} catch (err) {
				this.emit('end', 'Element on ' + n + ' position is not passing assertion:\n' + err.message);
				this.emit('close');
			}
		}
		i++;
		cb(null, obj);
	}).on('finish', function () {
		this.emit('end');
	});
};

assert.first = function (assertion) {
	return assert.nth(0, assertion);
};

assert.second = function (assertion) {
	return assert.nth(1, assertion);
};

assert.all = function (assertion) {
	var i = 0;
	return through.obj(function (obj, enc, cb) {
		try {
			assertion(obj);
		} catch (err) {
			this.emit('end', 'Element on ' + i + ' position is not passing assertion:\n' + err.message);
			this.emit('close');
		}
		i++;
		cb(null, obj);
	}).on('finish', function () {
		this.emit('end');
	});
};

assert.any = function (assertion) {
	var matched = false;
	return through.obj(function (obj, enc, cb) {
		try {
			assertion(obj);
			matched = true;
		} catch (err) { }
		cb(null, obj);
	}).on('finish', function () {
		if (!matched) {
			return this.emit('end', 'Not found any element in stream, that pass assertion');
		}
		this.emit('end');
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
				'Expected stream length to be eql ' + expected + ', but got ' + i
			));
		} else {
			this.emit('end');
		}
	});
};

module.exports = assert;
