/**!
 * 文件系统操作 工具函数
 * @author: larry / ll@yunshipei.com
 *
 * Copyright (c) 2013 Allmobilize Inc
 */

'use strict';

var pathModule = require('path');
var fsModule = require('fs');

var Q = require('q');
var extra = require('fs-extra');
var glob = require("glob");

var util = require('./util');

var fs = module.exports = util.extend({}, extra);

fs.process = function(pattern, options, handler) {
    var d = Q.defer();

    var g = new glob.Glob(pattern, options);
    options.thisArg = options.thisArg || this;
    options.ignoreError = options.ignoreError === true;
    options.onError = options.onError || function() {};
    options.onFinish = options.onFinish || function() {};

    g.on('error', function(e) {
        _onError(e);
    });

    function _onError(e) {
        if (!options.ignoreError) {
            g.pause();
            g.abort();
        }
        options.onError.apply(options.thisArg, arguments);
    };

    g.on('match', function(file) {
        try {
            handler.apply(options.thisArg, [file, {
                cwd: this.cwd,
                root: this.root,
                path: pathModule.join(this.root, file)
            }]);
        } catch (e) {
            _onError(e);
        }
    });

    g.on('end', function() {
        options.onFinish.apply(options.thisArg, arguments);
    });
};

// fs.process('*', {
//     root: './lib/test',
//     mark: true,
//     nosort: true,
//     // sync: true,
//     // debug: true,
//     // globDebug: true
//     onFinish: function(files) {
//         console.log(files, 'finish');
//     },
//     onError: function(e) {
//         console.log(e);
//     }
// }, function(file) {
//     console.log(file);
//     //throw new Error();
// });