/**!
 * 字典  !!! 请勿随意修改.
 * @author: larry / ll@yunshipei.com
 *
 * Copyright (c) 2014 Allmobilize Inc
 */

'use strict';

var util = require('./util');

var TYPES = module.exports.TYPES = {
    SellRecordStatus: 'SellRecord.Status'
};

var Dictionarys = [
    // 订单
    {
        type: TYPES.SellRecordStatus,
        label: '待支付',
        value: 20
    }, {
        type: TYPES.SellRecordStatus,
        label: '待开发',
        value: 25
    }, {
        type: TYPES.SellRecordStatus,
        label: '开发中',
        value: 30
    }, {
        type: TYPES.SellRecordStatus,
        label: '预览待确认',
        value: 35
    }, {
        type: TYPES.SellRecordStatus,
        label: '待上线',
        value: 40
    }, {
        type: TYPES.SellRecordStatus,
        label: '已上线',
        value: 45
    }
];

module.exports.findByLabel = function(label, type) {
    if (!label) {
        return '';
    }
    var criteria = {
        'label': label
    };
    if (type) {
        criteria.type = type;
    }
    return util.find(Dictionarys, criteria) || {};
};

module.exports.findByValue = function(value, type) {
    if (!value) {
        return '';
    }
    var criteria = {
        'value': value
    };
    if (type) {
        criteria.type = type;
    }
    return util.find(Dictionarys, criteria) || {};
};

module.exports.findByType = function(type) {
    if (!type) {
        return [];
    }
    var criteria = {
        'type': type
    };
    return util.where(Dictionarys, criteria) || [];
};