/**!
 * Allmobilize Connect Middleware - Response Extend
 * @author: larry / ll@yunshipei.com
 *
 * Copyright (c) 2013 Allmobilize Inc
 */

'use strict';

var util = require('../util');
var AccessDeniedException = require('../errors').AccessDeniedException;

module.exports = function(options) {
    var logger = console;
    if (util.has(options, 'logger')) {
        logger = options.logger;
    }
    options.failure = options.failure || function() {};
    return function(req, res, next) {
        /**
         * 发送失败方法.需附带错误原因.
         * @param  {Number} statusCode 可选的.
         * @param  {Error} err        可选.
         */
        res.failure = function(statusCode, err) {
            var error = err;
            var msg;
            var code = 500;
            if (statusCode instanceof Error) {
                error = statusCode;
            } else {
                code = statusCode;
            }

            if (error instanceof Error) {
                //console.log(error.message);
                msg = error.message;
                if (error instanceof AccessDeniedException) {
                    code = error.statusCode;
                }
            } else {
                msg = error || '服务器内部发生了错误.请稍候连接!';
                error = new Error(msg);
                logger.warn('错误信息不是由一个ERROR构成.');
            }

            // 兼容性
            if ('statusCode' in res) {
                res.statusCode = code;
            } else {
                res.status(code);
            }

            options.failure(req, res, error);
            var accept = req.headers.accept || '';

            if (~accept.indexOf('json') || req.headers['X-Requested-With'] || req.xhr) {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                    'code': code,
                    'data': msg,
                    'timestamp': util.getDateTime(new Date(), "YYYY-MM-DD HH:mm:ss.SSS")
                }));
            } else if (~accept.indexOf('html')) {
                next(error)
            } else {
                res.setHeader('Content-Type', 'text/plain');
                res.end(error.message);
            }
        };
        /**
         * 发送请求成功.
         * @param  {Number} statusCode 可选的.
         * @param  {any} any  返回数据.
         */
        res.success = function(statusCode, data) {

            res.setHeader('Content-Type', 'application/json');
            var result = data;
            var code = 200;
            if (arguments.length === 0) {
                result = 'ok';
            } else if (arguments.length === 1) {
                result = statusCode;
            } else {
                code = statusCode;
            }

            if ('statusCode' in res) {
                res.statusCode = code;
            } else {
                res.status(code);
            }

            res.end(JSON.stringify({
                'code': code,
                'data': result,
                'timestamp': util.getDateTime(new Date(), "YYYY-MM-DD HH:mm:ss.SSS")
            }));
        };
        res.validation = function(fn) {
            fn = fn || function() {};
            if (req.validationErrors) {
                var mappedErrors = req.validationErrors();
                if (mappedErrors) {
                    var err = new AccessDeniedException(req.url, JSON.stringify(mappedErrors));
                    if (fn(err)) {
                        return res.failure(err);
                    }
                }
            }
            fn();
        };
        next();
    }
}