# stream-assert [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][depstat-image]][depstat-url]

This library under heavy development. API will significally change, be brave to pull-request your suggestions about it.

### Assertion library wanted

`assert.first(function(data) { should.eql(1); })` could be `assert.first(should.eql(1))` if only `should` return assert function.

## Usage

```js
var array = require('stream-array');
var assert = require('stream-assert');
var should = require('should');

array([1, 2, 3])
	.pipe(assert.first(function(data) { should.eql(1); }))
	.pipe(assert.second(function(data) { should.eql(2); }))
	.pipe(assert.nth(2, function(data) { should.eql(3); }))
	.pipe(assert.length(1))
	.on('end', console.log);
```

## API

### stream-assert

Builder for asserting stream. Constructed stream will emit `end` on wrong assertion about stream with assertion error as first argument.

#### nth(n, assertion)

Calls `assertion` function on `nth` element in stream.

#### first(Function)
> alias to nth(0, obj)

#### second(Function)
> alias to nth(1, obj)

#### length(len)

Asserting, that length of stream is equal `len` at the end of the stream.

#### all(assertion)

Checking that all elements in stream pass assertion function.

#### any(assertion)

Checking that at least one of elements in stream pass assertion function.

## License

MIT (c) 2014 Vsevolod Strukchinsky

[npm-url]: https://npmjs.org/package/stream-assert
[npm-image]: https://badge.fury.io/js/stream-assert.png

[travis-url]: http://travis-ci.org/floatdrop/stream-assert
[travis-image]: https://travis-ci.org/floatdrop/stream-assert.png?branch=master

[depstat-url]: https://david-dm.org/floatdrop/stream-assert
[depstat-image]: https://david-dm.org/floatdrop/stream-assert.png?theme=shields.io
