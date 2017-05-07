'use strict';
var path = require('path');

var hashPath = function (pth, hash) {
  var basename = path.posix.basename(pth);
  var ext = path.extname(pth);
  var newname = path.posix.basename(pth, ext) + '-' + hash + ext;

  return pth.replace(basename, newname);
};

var realPath = function (pth, dist, delimiter) {
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
  realPath: function (pth, dist, delimiter) {
    if (arguments.length !== 3) {
      throw new Error('`path`, `dist` and `delimiter` required');
    }

    return realPath(pth, dist, delimiter);
  }
};