'use strict';
var path = require('path');

var hashPath = function(pth, hash) {
	var ext = path.extname(pth);

	return path.join(path.dirname(pth), path.posix.basename(pth, ext) + '-' + hash + ext);
};

var realPath = function(pth, dist, delimiter) {
	var subname = pth.replace(delimiter, '');

	return path.join(dist, subname);
};

module.exports = {
	hashPath: function (pth, hash) {
		if (arguments.length !== 2) {
			throw new Error('`path` and `hash` required');
		}

		return hashPath(pth, hash);
	},
	realPath: function(pth, dist, delimiter) {
		if (arguments.length !== 3) {
			throw new Error('`path`, `dist` and `delimiter` required');
		}

		return realPath(pth, dist, delimiter);
	}
};