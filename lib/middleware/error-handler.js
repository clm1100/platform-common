/**!
 * Error Handler Middleware.
 * @author: larry / ll@yunshipei.com
 *
 * Copyright (c) 2014 Allmobilize Inc
 */

'use strict';

module.exports = function(options) {

    return function errorHandler(err, req, res, next) {
        if (err.status) {
            res.statusCode = err.status;
        }
        var accept = req.headers.accept || '';
        // html
        if (~accept.indexOf('html')) {
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.end(err.message);
        } else {
            res.setHeader('Content-Type', 'text/plain');
            res.end(err.message);
        }
    };
};