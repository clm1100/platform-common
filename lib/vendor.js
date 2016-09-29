/**!
 * 提供商
 * @author: larry / ll@yunshipei.com
 *
 * Copyright (c) 2014 Allmobilize Inc
 */

'use strict';

var util = require('./util');

var AUTH_VENDOR_LIST = module.exports = [{
    name: '360-wangzhanweishi',
    token: 'e9f2aad3a4cb74f95ca55ab4cd30e132',
    email: 'autosite@yunshipei.com',
    debugEmail: 'autosite-test@yunshipei.com'
}, {
    name: 'baidu-zhidaohao',
    token: 'd3433d306dd385adbb323ce674b86968',
    email: 'baidu-zhidahao@yunshipei.com',
    debugEmail: 'baidu-zhidahao-test@yunshipei.com'
}, {
    name: '网林时代',
    token: 'd33114ddcf71749b9ab2fcca6faec01a',
    email: 'p-bjwanglinshidai@yunshipei.com',
    debugEmail: 'p-bjwanglinshidai@yunshipei.com'
}, {
    name: '济宁汇众',
    token: 'b4c8bdeb11ad197be4376c51d23c9797',
    email: 'p-jnhz@yunshipei.com',
    debugEmail: 'p-jnhz@yunshipei.com'
}, {
    name: 'IDC-亿腾科技',
    token: 'xxx',
    email: 'idc_bizsn@yunshipei.com',
    debugEmail: 'idc_bizsn@yunshipei.com'
}, {
    name: 'auto-test',
    token: 'xxx',
    email: 'auto-test@yunshipei.com',
    debugEmail: 'auto-test@yunshipei.com'
}, {
    name: 'auto-批量推送直达号',
    token: 'xxx',
    email: 'zhidahao_auto@yunshipei.com',
    debugEmail: 'zhidahao_auto@yunshipei.com'
}, {
    name: 'auto-spiderman',
    token: 'xxx',
    email: 'auto-spiderman@yunshipei.com',
    debugEmail: 'auto-spiderman@yunshipei.com'
}];

var AUTH_MAP = AUTH_VENDOR_LIST.AUTH_MAP = {
    TOKEN: {},
    NAME: {},
    EMAIL: {}
};
util.each(AUTH_VENDOR_LIST, function(info) {
    AUTH_MAP.TOKEN[info.token] =
        AUTH_MAP.NAME[info.name] =
        AUTH_MAP.EMAIL[info.email] =
        AUTH_MAP.EMAIL[info.debugEmail] = info;
});