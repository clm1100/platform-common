/**!
 * Cache Manager
 * @author: larry / ll@yunshipei.com
 *
 * Copyright (c) 2014 Allmobilize Inc
 */

'use strict';

var redis = require("redis");

var Q = require('q');
var prefix = process.env.AM_VERSION || 'pro';
//var EXPIRE = 60 * 60 * 12;
var EXPIRE = 5;

function Cache(bucket, defaultExpire) {
    this._client = redis.createClient();
    this._client.select(bucket);
    this._defaultExpire = defaultExpire || EXPIRE;
}

Cache.prototype.get = function(key) {
    var d = Q.defer();
    key = prefix + '-' + key;
    this._client.get(key, function(err, reply) {
        if (err) {
            return d.reject(err);
        }
        d.resolve(reply);
    });
    return d.promise;
};

Cache.prototype.put = function(key, value, expire) {
    var self = this;
    var d = Q.defer();
    expire = expire || self._defaultExpire;
    key = prefix + '-' + key;
    self._client.set(key, value, function(err, reply) {
        if (err) {
            return d.reject(err);
        }
        self._client.expire(key, expire);
        d.resolve(value);
    });
    return d.promise;
};

Cache.prototype.del = function(key) {
    var d = Q.defer();
    key = prefix + '-' + key;
    this._client.del(key, function(err, reply) {
        if (err) {
            return d.reject(err);
        }
        d.resolve(reply);
    });
    return d.promise;
};

Cache.prototype.exists = function(key) {
    var d = Q.defer();
    key = prefix + '-' + key;
    this._client.exists(key, function(err, reply) {
        if (err) {
            return d.reject(err);
        }
        d.resolve(reply);
    });
    return d.promise;
};

Cache.TYPE = {};
Cache.TYPE.DEVSERVER = 0;
Cache.TYPE.BUILDSERVER = 1;
Cache.TYPE.DEPLOYSERVER = 2;
Cache.TYPE.IDESERVER = 3;
Cache.TYPE.PROXYSERVER = 4;

module.exports = Cache;