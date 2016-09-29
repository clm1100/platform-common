/**!
 * Allmobilize Platform - Common Module - Logger
 * @author: larry / ll@yunshipei.com
 *
 * Copyright (c) 2013 Allmobilize Inc
 */

'use strict';

var util = require('./util');
var fs = require('fs');
var path = require('path');
var colors = require('colors');
var winston = require('winston');

var _colors = {
    log: 'inverse',
    trace: 'magenta',
    debug: 'green',
    info: 'cyan',
    warn: 'yellow',
    error: 'red'
};

/**
 * 扩展Winston显示文件路径和行号
 */
// TODO: 是否显示行信息 应该可以配置.
function showLineInfo(colorize) {
    var stack = (new Error()).stack.split('\n').slice(3);
    // Stack trace format :
    // http://code.google.com/p/v8/wiki/JavaScriptStackTraceApi
    //console.log(stack);
    var s = stack[7],
        sp = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/gi.exec(s) || /at\s+()(.*):(\d*):(\d*)/gi.exec(s);
    var data = {};
    if (sp.length === 5) {
        data.method = sp[1];
        data.path = sp[2];
        data.line = sp[3];
        data.pos = sp[4];
        data.file = path.basename(data.path);
        data.msg = (' at ' + data.path.replace(process.__basePath + '/', '') + ((':' + data.line) || '') + ((':' + data.pos) || '') + ' ' + (data.method || ''));
        if (colorize) {
            data.msg = data.msg.grey;
        }
    }
    return data;
}

/**
 * winston.transports.Console扩展
 */
winston.transports.ExtendConsole = function() {
    winston.transports.Console.apply(this, arguments);
    this.name = 'ExtendConsole';
};

util.inherits(winston.transports.ExtendConsole, winston.transports.Console);

winston.transports.ExtendConsole.prototype.log = function(level, msg, meta, callback) {
    var data = showLineInfo(this.colorize);
    winston.transports.Console.prototype.log.call(this, level, (this.colorize ? msg[_colors[level]] : msg) + data.msg, meta, callback);
};

/**
 * 每日文件日志扩展
 */
winston.transports.ExtendDailyRotateFile = function() {
    winston.transports.DailyRotateFile.apply(this, arguments);
    this.name = 'ExtendDailyRotateFile';
};

util.inherits(winston.transports.ExtendDailyRotateFile, winston.transports.DailyRotateFile);

winston.transports.ExtendDailyRotateFile.prototype.log = function(level, msg, meta, callback) {
    var data = showLineInfo(this.colorize);
    if (!this.__dir_exists) {
        /**
         * 检查log目录是否存在
         */
        this.__dir_exists = fs.existsSync(path.join(this.dirname, this.filename));
        if (!this.__dir_exists) {
            fs.mkdirSync(path.join(this.dirname, this.filename), '0775');
        }
    }
    winston.transports.DailyRotateFile.prototype.log.call(this, level, msg + data.msg, meta, callback);
};

winston.transports.Remote = require('am-winston-remote').Transport;

winston.transports.MongoDB = require('winston-mongodb').MongoDB;

/**
 * 配色方案
 */
winston.addColors(_colors);

module.exports = function(options) {
    var options = util.extend({
        //console: {
        //    silent: true
        //}
    }, options);
    // looger config
    var container = new winston.Container();
    var transports = [];
    util.each(options, function(transport, name) {
        var Transport = winston.transports[name];
        var t = new Transport(transport);
        transports.push(t);
    });
    // var logger = winston.loggers.add(options.name || Date.now(), options);
    // logger.add
    // logger.remove(winston.transports.Console);

    var id = 'am-logger';
    container.add(id, {
        transports: transports
    });
    return container.get(id);
};

module.exports.Winston = winston;


// 临时
var sender = require('fluent-logger');

//var util = require('util');
var DEFAULT_TAG = 'winston';
//var winston = require('winston');
var Transport = winston.Transport;

function FluentTransport(options) {
    options = options || {};
    var tag = options.tag || DEFAULT_TAG;

    this.sender = new sender.createFluentSender(tag, options);

    Transport.call(this);
}

util.inherits(FluentTransport, Transport);

FluentTransport.prototype.log = function(level, msg, meta, callback) {
    var self = this;
    var sender = self.sender;

    var data = {
        level: level,
        message: msg,
        meta: meta
    };

    sender.emit(data);
    callback(null, true);
    self.emit('logged');
};

winston.transports.Fluent = FluentTransport;
FluentTransport.prototype.name = module.exports.name = 'fluent';