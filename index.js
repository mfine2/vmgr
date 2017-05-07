'use strict';
var fs = require('fs');
var path = require('path');
var vhash = require('./v-hash');
var vpath = require('./v-path');
var src = '';
var dist = '';
var delimiter = '';

var processPath = function(pth, fn) {
    var realPath = vpath.realPath(pth, dist, delimiter);
    var hash = vhash(fs.readFileSync(realPath));
    var hashPath = vpath.hashPath(pth, hash);
    var hashRealPath = vpath.hashPath(realPath, hash);

    fn && fn(hashPath, realPath, hashRealPath);
};

var getHtmlPathList = function() {
    var files = fs.readdirSync(src);
    var htmlPathList = [];

    files.forEach(function(file) {
        if (path.extname(file) === '.html') {
            var filePath = path.join(src, file);

            htmlPathList.push(filePath);
        }
    });

    return htmlPathList;
};

var getStaticPathList = function(html) {
    var matches = html.match(/<(link|script).+?>/g);
    var staticPathList = [];

    matches.forEach(function(matched) {
        if (matched.indexOf('href') > 0 || matched.indexOf('src') > 0) {
            matched = matched.replace(/.+(href|src)="(.+?)".+/g, '$2');
            matched = matched.replace(/\?.+$/g, '');

            var ext = path.extname(matched);

            if (ext === '.js' || ext === '.css') {
                staticPathList.push(matched);
            }
        }
    });

    return staticPathList;
};

var processStaticPath = function(htmlPath) {
    fs.readFile(htmlPath, function(readErr, data) {
        if (readErr) {
			throw readErr;
        }

        var html = data.toString();
        var staticPathList = getStaticPathList(html);

        staticPathList.forEach(function(staticPath) {
            processPath(staticPath, function(hashPath, realPath, hashRealPath) {
                hashPath = hashPath.replace(/\\/g, '/');
                html = html.replace(staticPath, hashPath);
                //fs.rename(realPath, hashRealPath);
                console.log(hashPath, realPath, hashRealPath);
            });
        });

        fs.writeFile(htmlPath, html, function(writeErr) {
            if (writeErr) {
                throw writeErr;
            }
        });
    });
};

module.exports = function (args) {
    delimiter = args[0] || '';
    src = args[1] || __dirname;//where to read .html
    dist = args[2] || __dirname;//where to read .js/.css

    var htmlPathList = getHtmlPathList();

    htmlPathList.forEach(function(htmlPath) {
        processStaticPath(htmlPath);
    });
};