/**!
 * Allmobilize Platform - Common Module - Util Functions
 * @author: larry / ll@yunshipei.com
 *
 * Copyright (c) 2013 Allmobilize Inc
 */

'use strict';

var utilModule = require('util');
var crypto = require('crypto');

var moment = require('moment');
var _ = require('lodash');
var request = require('request');
var Q = require('q');
var url = require('url');
var uuid = require('uuid');
var isStream = require('isstream')

//Q.longStackSupport = true;

/**
 * util工具函数集
 * 工具函数来自 lodash和内建util模块
 * @type {[type]}
 */
_.extend(_, utilModule);
var util = module.exports = _;
util.isStream = isStream;
var _labels = {};
util.time = function(label) {
    _labels[label] = Date.now();
};

util.timeEnd = function(label) {
    var time = _labels[label];
    if (!time) {
        throw new Error('No such label: ' + label);
    }
    var duration = Date.now() - time;
    return duration;
};

/**
 * 处理用户的邮箱 匿名显示
 */
util.anonymousMail = function(str) {
    if (_.isString(str)) {
        var newStr = '';
        //按 @ 符号进行分割
        // sdafsad   qq.com
        var tempArr = str.split('@');
        if (tempArr.length == 2) {

            if (tempArr[0].length > 2) {
                //表示用户名  前缀大于2位的时候  asdf@sina.com
                var prefix = tempArr[0];
                for (var i = 0; i < prefix.length; i++) {
                    //前缀的 前两位 不匿  后面用* 表示
                    if (i < 2) {
                        newStr += prefix.charAt(i);
                    } else {
                        newStr += "*";
                    }
                }
                return newStr + "@" + tempArr[1];
            } else {
                //表示 用户名 有2位  22@qq.com 的时候
                return tempArr[0] + "****@" + tempArr[1];
            }
        }
    }
    return str;
}

/**
 * Date格式化
 *
 * @param  {Date} date
 * @param  {String} format @optional 默认为 YYYY-MM-DD HH:mm
 * @return {String}
 * @api public
 */
util.getDateTime = function(date, format) {
    if (!util.isDate(date)) {
        return date;
    }
    format = format || "YYYY-MM-DD HH:mm";
    return moment(date).zone('+08:00').format(format);
};

/**
 * Date格式化
 *
 * @param  {Date} date
 * @param  {String} format @optional 默认为 YYYY-MM-DD HH:mm
 * @return {Function}
 * @api public
 */
util.dateFormat = function(format) {
    return function(date) {
        return util.getDateTime(date, format);
    };
};

/**
 * Encrypt Text
 *
 * @param {String} text
 * @param {String} key 默认为 allmobilize
 * @return {String}
 * @api public
 */
util.encrypt = function(text, key) {
    key = key || 'allmobilize';
    if (!text) {
        return '';
    }
    return crypto.createHmac('sha1', key).update(text).digest('hex');
};

/**
 * Encrypt Text
 *
 * @param {String} text
 * @param {String} key 默认为 allmobilize
 * @return {String}
 * @api public
 */
util.md5 = function(text, key) {
    key = key || 'allmobilize';
    return crypto.createHmac('md5', key).update(text).digest('hex');
};

util.base64 = function(buf) {
    if (!Buffer.isBuffer(buf)) {
        buf = new Buffer(buf);
    }
    return buf.toString('base64');
};

util.unbase64 = function(base64, encoding) {
    encoding = encoding || 'utf8';
    return new Buffer(base64, 'base64').toString(encoding);
};

// 被弃用了.
// 使用 triggerInit
util.initialCDN = function(siteID) {
    var constants = require('../constants');
    var options = {
        url: constants.URL.deploy + siteID + '/initial',
        method: "put",
        form: {
            api: constants.api.key
        }
    };
    request(options, function(error, response, body) {
        if (error) {
            console.log('[error] request initial CDN');
            console.log(error);
        }
    });
};

util.capitalize = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

util.doBuild = function(action, siteID) {
    var constants = require('../constants');
    var options = {
        url: constants.URL.build + action + '/' + siteID,
        form: {
            key: constants.api.key,
            ignoreWorkflow: true,
            perferQueue: true
        },
        headers: {
            'Accept': 'application/json'
        },
        json: true

    };
    request.put(options, function(error, response, body) {
        if (response && response.statusCode === 200) {
            console.log('通知buildservice, action %s  success', action);
        } else {
            console.log('[error] request buidserver, action:%s', action);
            console.log(error, body);
        }
    });
};

util.projectInitial = function(siteID) {
    var constants = require('../constants');
    var options = {
        url: constants.URL.ide + 'projectInitial/' + siteID,
        form: {
            key: constants.api.key,
            isWorker: true
        }
    };
    request.post(options, function(error, response, body) {
        if (response && response.statusCode === 200) {
        } else {
            console.log('[error] initial project');
            console.log(error, body);
        }
    });
};

var self = this;
util.each(['publish', 'build', 'preview', 'init'], function(method) {
    var methodName = 'trigger' + util.capitalize(method);
    util[methodName] = util.doBuild.bind(self, method);
});

util.move = function(array, oldIndex, newIndex) {
    if (newIndex >= array.length) {
        var k = newIndex - array.length;
        while ((k--) + 1) {
            array.push(undefined);
        }
    }
    array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
    return array;
};

util.eachLimit = function(tasks, limit) {
    if (!util.isArray(tasks)) {
        return;
    }
    limit = limit || 10;

    var queue = [],
        results = [],
        step = 0;
    var d = Q.defer();
    var p = d.promise;

    while (true) {
        var end = step + limit;
        queue.push(tasks.slice(step, end));
        if (end >= tasks.length) {
            break;
        }
        step = end;
    }
    var success = function(result) {
        results.push(result);
    };
    var wrapper = function(part) {
        return function() {
            return Q.all(part).then(success);
        };
    };
    d.resolve();
    while (true) {
        var part = queue.shift();
        if (!part) {
            break;
        }
        p = p.then(wrapper(part));
    }
    return p.then(function(result) {
        return util.flatten(results);
    });
};

util.arrayToMap = function(array, key, fn) {
    if (!array) {
        return {};
    }
    if (!util.isArray(array)) {
        throw new Error('The first parameter is not a array');
    }
    if (util.isArray(key)) {
        throw new Error('The second parameter is not a string');
    }
    if (fn) {
        if (util.isFunction(fn)) {
            fn = function(index, item) {
                return item;
            };
        } else {
            var _key = fn;
            fn = function(index, item) {
                return item[_key];
            };
        }
    }

    var map = {};
    util.each(array, function(item, index) {
        map[item[key] || index] = fn(index, item);
    });
    return map;
};

var ADMIN_EMAIL = 'admin@yunshipei.com';
util.generalSiteID = function generalSiteID(host, email) {
    if (email) {
        if (email.indexOf("@yunshipei.com") > 0) {
            email = ADMIN_EMAIL;
        }
    } else {
        email = ADMIN_EMAIL;
    }
    var siteHost = host.replace(/^http:\/\//, '').replace(/\/$/, ''),
        siteID = require('crypto').createHmac('md5', email).update(siteHost + new Date()).digest('hex');
    return siteID;
};

util.generalBucketName = function generalBucketName(siteID, host) {
    var shortID;
    if (siteID.length === 32) {
        shortID = siteID;
    } else {
        shortID = generalSiteID(host);
    }
    shortID = "ysp" + shortID.substring(8, 24);
    return shortID;
}

util.callParent = function(parent, methodName, self, args) {
    var method = parent.prototype[methodName] || function() {
        throw new Error('not find method.' + methodName);
    };
    return method.apply(self, args);
};

util.capitalize = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};
/**
 * 得到网站的host  http://www.baidu.com:80/re?asdfasdf=123   www.baidu.com:80
 * @param str
 */
util.getHost = function(str) {
    var u = url.parse(str);
    if (u.protocol != 'http:' && u.protocol != 'https:') {
        u = url.parse('http://' + str);
    }
    if (u.host) {

    } else {
        u = url.parse('http://' + str); // TODO: HTTPS没有判断
    }
    return u.host;

}
/**
 * 得到一个uuid
 * @param str
 * @returns {*}
 * @constructor
 */
util.UUID = function() {
    return uuid.v1().replace(/\-/g, '');
}
/**
 * 验证邮箱是否正确
 * @param email
 * @returns {*}
 */
util.testEmail = function(email) {
    var regex = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
    return regex.test(email);
}

util.getPassword = function(minLength, maxLength) {
    if (minLength <= 0) {
        throw new Error('无效的参数.');
    }
    minLength = minLength || 8;
    maxLength = maxLength || minLength;
    var text = ['abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', '1234567890', '!@#$*'];
    var rand = function(min, max) {
        return Math.floor(Math.max(min, Math.random() * (max + 1)));
    }
    var len = rand(minLength, maxLength);
    var pw = [];
    for (var i = 0; i < len; ++i) {
        var strpos = rand(0, text.length - 1);
        var charPostion = rand(0, text[strpos].length);
        pw.push(text[strpos].charAt(charPostion));
    }
    return pw.join('');
};

util.retry = require('qretry');


/**
 *
 * ?表示 不确定这个对象存在
 * https://github.com/juliangruber/deep-access
 *
 * var obj = {
  foo: 'bar',
  bar: {
    baz: {
      beep: 'boop'
    }
  }
};

 console.log(deepObject(obj, 'foo'));
 // => "bar"

 console.log(deepObject(obj, 'bar.baz.beep'));
 // => "boop"

 console.log(deepObject(obj, 'foo.beep.boop'));
 // throws


 console.log(deepObject(obj, 'foo.beep?.boop'));
 // => undefined

 * @param obj
 * @param prop
 * @returns {*}
 */
util.deepObject = function(obj, prop) {
    var segs = prop.split('.');
    while (segs.length) {
        var seg = segs.shift();
        var existential = false;
        if (seg[seg.length - 1] == '?') {
            seg = seg.slice(0, -1);
            existential = true;
        }
        obj = obj[seg];
        if (!obj && existential) return obj;
    }
    return obj;
}
