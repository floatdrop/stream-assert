var through = require('through2');

var assert = {};

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
