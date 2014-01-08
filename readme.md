# [gulp](http://gulpjs.com)-sweetjs [![Build Status](https://secure.travis-ci.org/sindresorhus/gulp-sweetjs.png?branch=master)](http://travis-ci.org/sindresorhus/gulp-sweetjs)

> Transpile [Sweet.js](https://github.com/mozilla/sweet.js) macros


## Install

Install with [npm](https://npmjs.org/package/gulp-sweetjs)

```
npm install --save-dev gulp-sweetjs
```


## Example

```js
var gulp = require('gulp');
var sweetjs = require('gulp-sweetjs');

gulp.task('default', function () {
	gulp.src('src/app.js')
		.pipe(sweetjs({modules: ['module-name']}))
		.pipe(gulp.dest('dist'));
});
```


## API

### sweetjs(options)

#### options

##### sourceMap

Type: `Boolean`  
Default: `false`

Enable Source Map.

##### modules

Type: `Array`  
Default: `[]`

A list of macros you want to use.

Use the same syntax as you would in `require()`:

- npm module: `'module-name'`
- local file: `'./file-name'`


## License

MIT © [Sindre Sorhus](http://sindresorhus.com)
