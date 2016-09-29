/**!
 *
 * @author: larry / ll@yunshipei.com
 *
 * Copyright (c) 2013 Allmobilize Inc
 */

'use strict';
/**
 * 该段代码来自 https://github.com/LearnBoost/connect-timeout
 *
 * //TODO: 暂时有问题, 以后再弄.
 */
module.exports = function responseTimeout(options) {
    options = options || {};
    options.time = options.time || 8000;
    options.code = options.code || 500;
    options.throwError = options.throwError || options.throwError === undefined;
    options.callback = options.callback || function(){};

    return function responseTimeout(req, res, next) {
        var writeHead = res.writeHead,
            timer = setTimeout(function() {
                if (options.throwError) {
                    next(new Error('Timeout ' + req.method + ' ' + req.url));
                } else {
                    res.writeHead(options.code);
                    res.end(options.callback(req, res));
                }
            }, options.time);

        req.clearTimeout = function() {
            clearTimeout(timer);
        };

        res.writeHead = function(code, headers) {
            res.writeHead = writeHead;
            req.clearTimeout();
            res.writeHead(code, headers);
        };

        next();
    }
};