/**!
 * Error
 * @author: larry / ll@yunshipei.com
 *
 * Copyright (c) 2013 Allmobilize Inc
 */

'use strict';

var util = require('../util');

var Base = module.exports.Base = function(message, fileName, line) {
    Error.captureStackTrace(this, Base);
    Base.super_.call(this, message, fileName, line);
    this.message = message;
}
util.inherits(Base, Error);

var HttpException = module.exports.HttpException = function(statusCode, message) {
    this.statusCode = statusCode;
    this.message = message;

    HttpException.super_.call(this, this.message);
};
util.inherits(HttpException, Base);

var AccessDeniedException = module.exports.AccessDeniedException = function(url, message) {
    message = message || '';
    this.message = '禁止访问! URL:' + url + '  ' + message;

    AccessDeniedException.super_.call(this, 401, this.message);
};
util.inherits(AccessDeniedException, HttpException);