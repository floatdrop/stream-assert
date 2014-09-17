# stream-assert
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url] [![Dependency Status][depstat-image]][depstat-url]

Assert streams with ease.

## Usage

```js
var array = require('stream-array');
var assert = require('stream-assert');
var should = require('should');

array([1, 2, 3])
    .pipe(assert.first(function(data) { data.should.eql(1); }))
    .pipe(assert.second(function(data) { data.should.eql(2); }))
    .pipe(assert.nth(2, function(data) { data.should.eql(3); }))
    .pipe(assert.length(1))
    .pipe(assert.end(console.log));
```

## Chaining

Assertions are chained through passing `assertion` from pipe to pipe. If you want inject assertions in the middle of pipeline, you can attach `on('assertion')` handler to manualy catch assertions (instead of placing `assert.end`).


## API

### stream-assert

Builder for asserting stream.

#### nth(n, assertion)

Calls `assertion` function on `nth` element in stream.

#### first(assertion)
> alias to nth(0, obj)

#### second(assertion)
> alias to nth(1, obj)

#### last(assertion)

Calls `assertion` function on the last element in stream.

#### length(len)

Asserting, that length of stream is equal `len` at the end of the stream.

#### all(assertion)

Checking that all elements in stream pass assertion function.

#### any(assertion)

Checking that at least one of elements in stream pass assertion function.

#### end([cb])

Since streams has internal [buffer and highWatermark](http://nodejs.org/api/stream.html#stream_buffering),
that stops data flow, when reached — test stream needs a dumping point, that will flush that buffer.

`assert.end` will dump all data to `/dev/null` — so all pipes after this point will not get any data.

### assert.defaults
Type: `Object`  

Contains defaults, that will be passed to `through` constructor.

 * `highWatermark` — by default, will be equal `16`. If you don't want to use `assert.end`, then you can increase it.

## License

MIT (c) 2014 Vsevolod Strukchinsky

[npm-url]: https://npmjs.org/package/stream-assert
[npm-image]: http://img.shields.io/npm/v/stream-assert.svg?style=flat

[travis-url]: http://travis-ci.org/floatdrop/stream-assert
[travis-image]: http://img.shields.io/travis/floatdrop/stream-assert.svg?branch=master&style=flat

[depstat-url]: https://david-dm.org/floatdrop/stream-assert
[depstat-image]: http://img.shields.io/david/floatdrop/stream-assert.svg?style=flat

[coveralls-url]: https://coveralls.io/r/floatdrop/stream-assert
[coveralls-image]: http://img.shields.io/coveralls/floatdrop/stream-assert.svg?style=flat
