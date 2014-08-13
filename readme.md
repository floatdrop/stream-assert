# stream-assert [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][depstat-image]][depstat-url]

This library under heavy development. API will significally change, be brave to pull-request your suggestions about it.

## Usage

```js
var array = require('stream-array');
var assert = require('stream-assert');

array([1, 2, 3])
	.pipe(assert.length(1))
	.on('end', console.log);
```

## API

### stream-assert

Builder for asserting stream. Constructed stream will emit `error` and `end` on wrong assertion about stream with assertion error as first argument.

#### length(len)

Asserting, that length of stream is equal `len` at the end of the stream.

#### first(obj)

Deep equal first object in stream with `obj`.

#### contains(obj)

Searches `obj` in stream.

## License

MIT (c) 2014 Vsevolod Strukchinsky

[npm-url]: https://npmjs.org/package/stream-assert
[npm-image]: https://badge.fury.io/js/stream-assert.png

[travis-url]: http://travis-ci.org/floatdrop/stream-assert
[travis-image]: https://travis-ci.org/floatdrop/stream-assert.png?branch=master

[depstat-url]: https://david-dm.org/floatdrop/stream-assert
[depstat-image]: https://david-dm.org/floatdrop/stream-assert.png?theme=shields.io
