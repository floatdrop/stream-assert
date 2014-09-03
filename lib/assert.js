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
		this.emit('data', obj);
		cb(null);
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
		this.emit('data', obj);
		cb(null);
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
		this.emit('data', obj);
		cb(null);
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
		this.emit('data', obj);
		cb(null);
	}).on('finish', function () {
		var assertion = expected;
		if (typeof expected !== 'function') {
			assertion = function (data) {
				if (data !== expected) throw new Error(data + ' not equal ' + expected);
			}
		}

		try {
			assertion(i);
			this.emit('end');
		} catch (err) {
			this.emit('end', new Error( 'Stream length ' + err.message ));
		}
	});
};

module.exports = assert;
