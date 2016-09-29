/**!
 * Dev Server - Auth
 * @author: larry / ll@yunshipei.com
 *
 * Copyright (c) 2013 Allmobilize Inc
 */

'use strict';

var Q = require('q');

var util = require('../util');
var Errors = require('../errors');
var constants = require('../constants');

module.exports = function(app, doAuthentication) {

    function auth(func) {

        return function(req, res, next) {

            var args = arguments;
            if (req.body && (req.body.key === constants.api.key)) {
                return func.apply(app._router, args);
            }
            doAuthentication(req, res).done(function() {
                func.apply(app._router, args);
            }, function(err) {
                if (err instanceof Errors.AccessDeniedException) {
                    if ('statusCode' in res) {
                        res.statusCode = err.statusCode;
                    } else {
                        res.status(err.statusCode);
                    }
                }
                if (res.failure) {
                    res.failure(err);
                } else {
                    next(err);
                }
            });
        }
    }

    util.each(['post', 'get', 'put', 'delete'], function(method) {
        var oldMethod = app[method];
        app[method] = function(route, func) {
            // fix express.get
            if ('get' == method && 1 == arguments.length) {
                return app.set(route);
            }
            var args = Array.prototype.slice.call(arguments, 0);
            args[1] = auth(func);
            oldMethod.apply(app, args);
        }
    });
}