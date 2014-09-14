var through = require('through2');

var assert = {};

function assertStream() {
	var stream = through.obj.apply(through, arguments);

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
				this.bubble(new Error('Element on ' + n + ' position is not passing assertion:\n' + err.message));
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
			this.bubble(new Error('Last element is not passing assertion:\n' + err.message));
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
			this.bubble(new Error('Element on ' + i + ' position is not passing assertion:\n' + err.message));
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
			return this.bubble(new Error('Not found any element in stream, that pass assertion'));
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
					throw new Error(data + ' not equal ' + expected);
				}
			};
		}

		try {
			assertion(i);
			this.emit('end');
		} catch (err) {
			this.bubble(new Error( 'Stream length ' + err.message ));
		}
	});
};

module.exports = assert;
