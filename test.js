'use strict';
var assert = require('assert');
var gutil = require('gulp-util');
var sweetjs = require('./index');

it('should compile macro', function (cb) {
	this.timeout(5000);

	var i = 0;
	var stream = sweetjs({
		sourceMap: true,
		modules: ['./fixture-macro.js']
	});

	stream.on('data', function (file) {
		i++;

		if (/.js$/.test(file.path)) {
			assert(/console\.log/.test(file.contents.toString()));
			assert.equal(file.relative, 'fixture.js');
			return;
		}

		assert(/\"version":3/.test(file.contents.toString()));
		assert.equal(file.relative, 'fixture.map');

		if (i === 2) {
			cb();
		}
	});

	stream.write(new gutil.File({
		path: __dirname + '/fixture.js',
		contents: new Buffer('var x = $y(function(fac){ return function(n){ if(n == 1) return 1; return n * fac(n-1); }});console.log(x(5));')
	}));

	stream.end();
});
