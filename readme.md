# stream-assert
[![Build Status][travis-image]][travis-url]

Assert streams with ease.

## Usage

```js
var intoStream = require('into-stream');
var assert = require('stream-assert');
var is = require('funsert');

intoStream([1, 2, 3])
    .pipe(assert.first(is.equal(1)))
    .pipe(assert.second(is.equal(2)))
    .pipe(assert.nth(2, is.equal(3)))
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

[travis-url]: http://travis-ci.org/floatdrop/stream-assert
[travis-image]: http://img.shields.io/travis/floatdrop/stream-assert.svg?branch=master&style=flat
