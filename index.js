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

	stream.on('pipe', function (source) {
		source._piped = true;
		source.on('error', function (err) {
			stream._parentError = err;
		});
	});

	stream.bubble = function (err) {
		this.emit(this._piped ? 'error' : 'end', err);
	};

	return stream;
}

assert.nth = function (n, assertion) {
	var i = 0;
	return assertStream(function (obj, enc, cb) {
		if (i === n) {
			try {
				assertion(obj);
			} catch (err) {
				this.bubble(new Error(n + ' position is not passing assertion: ' + err.message));
				this.emit('close');
			}
		}
		i++;
		this.push(obj);
		cb();
	}).on('finish', function () {
		this.bubble(this._parentError);
	});
};

assert.last = function (assertion) {
	var lastItem;
	return assertStream(function (obj, enc, cb) {
		lastItem = obj;
		this.push(obj);
		cb();
	}).on('finish', function () {
		if (this._parentError) { return this.emit('end', this._parentError); }
		try {
			assertion(lastItem);
			this.emit('end');
		} catch (err) {
			this.bubble(new Error('Last element is not passing assertion: ' + err.message));
			this.emit('close');
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
		} catch (err) {
			this.bubble(new Error('Element on ' + i + ' position is not passing assertion: ' + err.message));
			this.emit('close');
		}
		i++;
		this.push(obj);
		cb();
	}).on('finish', function () {
		this.emit('end', this._parentError);
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
	}).on('finish', function () {
		if (this._parentError) { return this.emit('end', this._parentError); }

		if (!matched) {
			return this.bubble(new Error('Nothing passing assertion'));
		}
		this.emit('end');
	});
};

assert.length = function (expected) {
	var i = 0;
	return assertStream(function (obj, enc, cb) {
		i++;
		this.push(obj);
		cb();
	}).on('finish', function () {
		if (this._parentError) { return this.emit('end', this._parentError); }

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
			this.emit('end');
		} catch (err) {
			this.bubble(new Error('Expected length ' + err.message));
		}
	});
};

assert.end = function (cb) {
	return assertStream(function (obj, enc, cb) {
		// Dump all the data!
		cb();
	})
	.on('finish', function () {
		if (cb) { cb(this._parentError); }
		this.emit('end', this._parentError);
	});
};

module.exports = assert;
