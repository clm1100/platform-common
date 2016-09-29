/**!
 * Mail Sender
 * @author: larry / ll@yunshipei.com
 *
 * Copyright (c) 2014 Allmobilize Inc
 */

'use strict';

var nodemailer = require('nodemailer');
var Q = require('q');

var util = require('./util');

var DEFAULT_MESSAGE = {

    from: 'robot <sys-robot@yunshipei.com>',

    to: '"bugs" <bugs@yunshipei.com>',

    subject: 'unknown', //

    headers: {
        'X-Laziness-level': 1000
    },

    text: 'unknown',

    html: 'unknown'
};

var Mailer = module.exports = function(options) {
    options = options || {};
    this._transport = nodemailer.createTransport("SMTP", {
        host: "smtp.exmail.qq.com",
        secureConnection: true,
        port: 465,
        auth: {
            user: options.user || "sys-robot@yunshipei.com",
            pass: options.password || "html5.js"
        }
    });
};

Mailer.prototype.send = function(message) {
    var d = Q.defer();
    message = util.merge(DEFAULT_MESSAGE, message);
    this._transport.sendMail(message, function(error) {
        if (error) {
            return d.reject();
        }
        d.resolve();
    });
    return d.promise;
};