'use strict';
var fs = require('fs');
var path = require('path');
var gutil = require('gulp-util');
var through = require('through');
var sweetjs = require('sweet.js');
var baseDir = process.cwd();

function compile(file, options) {
	var result;

	try {
		result = sweetjs.compile(file.contents.toString(), options);
	} catch (err) {
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

	return through(function (file) {
		var self = this;

		if (file.isNull()) {
			return this.queue(file);
		}

		if (file.isStream()) {
			return this.emit('error', new gutil.PluginError('gulp-sweetjs', 'Streaming not supported'));
		}

		options.filename = path.basename(file.path);

		if (Array.isArray(options.modules)) {
			options.modules = options.modules.map(function (module) {
				return sweetjs.loadNodeModule(baseDir, module);
			});
		}

		compile.call(this, file, options);
	});
};
