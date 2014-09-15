var through = require('through2');

function assertStream(options, transform, flush) {
	options = options || {};

	if (typeof options === 'function') {
		flush     = transform;
		transform = options;
		options   = {};
	}

	options.highWatermark = options.highWatermark || 16;
	options.objectMode = options.objectMode || true;

	var stream = through(options, transform, flush);

	stream.on('pipe', function (source) {
		source.on('assertion', function (err) {
			stream.emit('assertion', err);
		});
	});

	stream.assertion = function (message) {
		this.emit('assertion', new Error(message));
	};

	return stream;
}

module.exports = assertStream;
