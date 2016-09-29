/**!
 *
 * @author: larry / ll@yunshipei.com
 *
 * Copyright (c) 2014 Allmobilize Inc
 */

'use strict';

var path = require('path');
var util = require('./util');
var dotenv = require('dotenv');
dotenv.load();
var debug = require('debug')('am-env');

function mergeCallback(v1, v2) {
    return util.isArray(v1) ? v2 : undefined;
}

module.exports = function(configDir, baseConfig) {
    var env = process.env.NODE_ENV || 'development';
    var result = baseConfig;
    try {
        result = util.merge(baseConfig, require(path.join(configDir, 'config.' + env)), mergeCallback);
    } catch (e) {
        if (~e.message.indexOf('Cannot find module')) {
            debug('-************** Unable load to <NODE_ENV> Config. **************-');
        } else {
            throw e;
        }
    }
    // 如果为开发环境, 则继续加载开发者配置文件. 没有配置开发者配置文件时, 则不加载.
    switch (env) {
        case 'development':
            {
                process.env.USER = process.env.USER || process.env.USERNAME;
                if (process.env.USER) {
                    try {
                        var userConfig = require(path.join(configDir, 'config.' + process.env.USER));
                        util.merge(result, userConfig, mergeCallback);
                    } catch (e) {
                        debug('-************** Unable load to <USER> Config. **************-');
                    }
                } else {
                    debug('-************** USER variable not found. **************-');
                }
                break;
            }
        case 'production':
            {
                if (process.env.AM_VERSION) {
                    try {
                        var versionConfig = require(path.join(configDir, 'config.' + process.env.AM_VERSION));
                        util.merge(result, versionConfig, mergeCallback);
                    } catch (e) {
                        debug('-************** Unable load to <AM_VERSION> Config. **************-');
                    }
                } else {
                    debug('-************** AM_VERSION variable not found. **************-');
                }
                break;
            }
    }
    return result;
};