var assertStream = require('./assertStream.js');
var assert = {};

function equal(expected) {
	if (typeof expected !== 'function') {
		return function (data) {
			if (data !== expected) {
				throw new Error(expected + ' is not equal ' + data);
			}
		};
	}
	return expected;
}

var defaults = assert.defaults = {
	highWatermark: 16,
	objectMode: true
};

assert.all = function (assertion) {
	var i = 0;
	return assertStream(defaults, function (obj, enc, cb) {
		try {
			assertion(obj);
			i++;
			cb(null, obj);
		} catch (err) {
			this.assertion('Element on ' + i + ' position is not passing assertion: ' + err.message);
		}
	});
};

assert.any = function (assertion) {
	var matched = false;
	return assertStream(defaults, function (obj, enc, cb) {
		try {
			assertion(obj);
			matched = true;
		} catch (err) { }
		cb(null, obj);
	}, function (cb) {
		if (!matched) {
			return this.assertion('Nothing passing assertion');
		}
		cb();
	});
};

assert.end = function (done) {
	var stream = assertStream(defaults, function (obj, enc, cb) {
		cb();
	});
	stream.on('finish', done || function () {});
	stream.on('assertion', done || function () {});
	return stream;
};

assert.first = function (assertion) {
	return assert.nth(0, assertion);
};

assert.last = function (assertion) {
	var lastItem;
	return assertStream(defaults, function (obj, enc, cb) {
		cb(null, lastItem = obj);
	}, function (cb) {
		try {
			assertion(lastItem);
			cb();
		} catch (err) {
			this.assertion('Last element is not passing assertion: ' + err.message);
		}
	});
};

assert.length = function (expected) {
	var i = 0;
	return assertStream(defaults, function (obj, enc, cb) {
		i++;
		cb(null, obj);
	}, function (cb) {
		var assertion = equal(expected);

		try {
			assertion(i);
			cb();
		} catch (err) {
			this.assertion('Expected length ' + err.message);
		}
	});
};

assert.nth = function (n, assertion) {
	var i = 0;
	return assertStream(defaults, function (obj, enc, cb) {
		if (i === n) {
			try {
				assertion(obj);
				i++;
				cb(null, obj);
			} catch (err) {
				this.assertion(n + ' position is not passing assertion: ' + err.message);
			}
		} else {
			i++;
			cb(null, obj);
		}
	});
};

assert.second = function (assertion) {
	return assert.nth(1, assertion);
};

module.exports = assert;
