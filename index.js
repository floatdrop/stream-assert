var through = require('through2');

var assert = {};

assert.defaults = {
	highWatermark: 16,
	objectMode: true
};

function assertStream(options, transform, flush) {
	if (typeof options === 'function') {
		flush     = transform;
		transform = options;
		options   = {};
	}

	options.highWatermark = options.highWatermark || assert.defaults.highWatermark;
	options.objectMode = options.objectMode || assert.defaults.objectMode;

	var stream = through(options, transform, flush);

	stream.on('assertion', function (error) {
		stream._error = error;
	});

	stream.on('pipe', function (source) {
		source.on('assertion', function (err) {
			stream.emit('assertion', err);
		});
	});

	stream.assertion = function (message) {
		this.emit('assertion', new Error(message));
	};

	stream._emit = stream.emit;
	stream.emit = function (event) {
		if (event === 'end') {
			var args = Array.prototype.slice.call(arguments);
			args.push(stream._error);
			return stream._emit.apply(stream, args);
		}
		stream._emit.apply(stream, arguments);
	};

	stream.on('finish', function () {
		this.emit('end');
	});

	return stream;
}

assert.nth = function (n, assertion) {
	var i = 0;
	return assertStream(function (obj, enc, cb) {
		if (i === n) {
			try {
				assertion(obj);
				i++;
				cb(null, obj);
			} catch (err) {
				this.assertion(n + ' position is not passing assertion: ' + err.message);
			}
		}
	});
};

assert.last = function (assertion) {
	var lastItem;
	return assertStream(function (obj, enc, cb) {
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

assert.first = function (assertion) {
	return assert.nth(0, assertion);
};

assert.second = function (assertion) {
	return assert.nth(1, assertion);
};

assert.all = function (assertion) {
	var i = 0;
	return assertStream(function (obj, enc, cb) {
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
	return assertStream(function (obj, enc, cb) {
		try {
			assertion(obj);
			matched = true;
		} catch (err) { }
		this.push(obj);
		cb();
	}, function () {
		if (!matched) { this.assertion('Nothing passing assertion'); }
	});
};

assert.length = function (expected) {
	var i = 0;
	return assertStream(function (obj, enc, cb) {
		i++;
		cb(null, obj);
	}, function (cb) {
		var assertion = expected;
		if (typeof expected !== 'function') {
			assertion = function (data) {
				if (data !== expected) {
					throw new Error(expected + ' is not equal ' + data);
				}
			};
		}

		try {
			assertion(i);
			cb();
		} catch (err) {
			this.assertion('Expected length ' + err.message);
		}
	});
};

assert.end = function (done) {
	return assertStream(function (obj, enc, cb) { cb(); })
		.on('end', done || function () {});
};

module.exports = assert;
