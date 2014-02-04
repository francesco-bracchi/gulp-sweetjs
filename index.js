'use strict';
var path = require('path');
var gutil = require('gulp-util');
var through = require('through2');
var sweetjs = require('sweet.js');
var baseDir = process.cwd();

module.exports = function (options) {
	options = options || {};
  
        if (Array.isArray(options.modules)) {
                options.modules = options.modules.map(function (module) {
                        return sweetjs.loadNodeModule(baseDir, module);
                });
        }

	return through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			this.push(file);
			return cb();
		}

		if (file.isStream()) {
			this.emit('error', new gutil.PluginError('gulp-sweetjs', 'Streaming not supported'));
			return cb();
		}

		options.filename = path.basename(file.path);

		try {
			var result = sweetjs.compile(file.contents.toString(), options);
			var code = result.code;

			if (options.sourceMap) {
				code += '\n//# sourceMappingURL=' + gutil.replaceExtension(options.filename, '.map');
			}

			file.contents = new Buffer(code);

			if (result.sourceMap) {
				this.push(new gutil.File({
					cwd: file.cwd,
					base: file.base,
					path: gutil.replaceExtension(file.path, '.map'),
					contents: new Buffer(result.sourceMap)
				}));
			}
		} catch (err) {
			this.emit('error', new gutil.PluginError('gulp-sweetjs', err));
		}

		this.push(file);
		cb();
	});
};
