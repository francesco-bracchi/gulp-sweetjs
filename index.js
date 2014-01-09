'use strict';
var fs = require('fs');
var path = require('path');
var gutil = require('gulp-util');
var through = require('through');
var resolve = require('resolve');
var eachAync = require('each-async');
var sweetjs = require('sweet.js');

function compile(file, options) {
	var result;

	try {
		result = sweetjs.compile(file.contents.toString(), options);
	} catch (err) {
		console.log(err)
		return this.emit('error', new gutil.PluginError('gulp-sweetjs', err));
	}

	var code = result.code;

	if (options.sourceMap) {
		code += '\n//# sourceMappingURL=' + gutil.replaceExtension(options.filename, '.map');
	}

	file.contents = new Buffer(code);
	this.emit('data', file);

	if (result.sourceMap) {
		this.emit('data', new gutil.File({
			cwd: file.cwd,
			base: file.base,
			path: gutil.replaceExtension(file.path, '.map'),
			contents: new Buffer(result.sourceMap)
		}));
	}
}

module.exports = function (options) {
	options = options || {};

	var macros;

	return through(function (file) {
		var self = this;

		if (file.isNull()) {
			return this.queue(file);
		}

		if (file.isStream()) {
			return this.emit('error', new gutil.PluginError('gulp-sweetjs', 'Streaming not supported'));
		}

		options.filename = path.basename(file.path);

		if (macros === undefined) {
			macros = [];
			eachAync(options.modules || [], function (el, i, next) {
				resolve(el, {basedir: process.cwd()}, function (err, res) {
					if (err) {
						return self.emit('error', new gutil.PluginError('gulp-sweetjs', err));
					}

					fs.readFile(res, 'utf8', function (err, data) {
						if (err) {
							return self.emit('error', new gutil.PluginError('gulp-sweetjs', err));
						}

						macros.push(data);
						next();
					});
				});
			}, function (err) {
				if (err) {
					return self.emit('error', new gutil.PluginError('gulp-sweetjs', err));
				}

				options.macros = macros.join('\n');
				compile.call(self, file, options);
			});

			return;
		}

		compile.call(this, file, options);
	});
};
