/**!
 * Allmobilize Platform - Common Module
 * @author: larry / ll@yunshipei.com
 *
 * Copyright (c) 2013 Allmobilize Inc
 */

'use strict';
var dotenv = require('dotenv');
dotenv.load();

var dnscache = require('dnscache')({
    "enable" : true,
    "ttl" : 3000,
    "cachesize" : 1000
});

var common = module.exports;
common.constants = require('./lib/constants');  // 云适配常量.
common.util = require('./lib/util'); // 工具类 基于lodash 内建util模块.
common.log = require('./lib/log');  // 日志扩展  基于Winston
common.fs = require('./lib/fs');  // 文件系统工具类 基于FS-EXTRA
common.hbs_helpers = require('./lib/hbs-helpers');  // hbs扩展
common.middleware = require('./lib/middleware');  // Connect/Express 中间件
common.Upyun = require('./lib/upyun');  // 又拍云API