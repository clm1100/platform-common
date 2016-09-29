/**!
 * 域名解析服务.
 * @author: larry / ll@yunshipei.com
 *
 * Copyright (c) 2014 Allmobilize Inc
 */

'use strict';

var dnsModule = require('dns');
var Q = require('q');

module.exports.lookup = function(domain) {
    var d = Q.defer();
    dnsModule.lookup(domain, function(err, ip, family) {
        if (err) {
            return d.reject(err);
        }
        d.resolve({
            ip: ip,
            family: family
        });
    });
    return d.promise;
};