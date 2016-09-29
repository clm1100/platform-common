/**!
 * Allmobilize Constants
 * @author: larry / ll@yunshipei.com
 *
 * Copyright (c) 2013 Allmobilize Inc
 */

'use strict';

var util = require('./util');

var DEFAULT = module.exports;

DEFAULT.api = {};
DEFAULT.api.key = 'mYN37miGOTpJ$^7d';

DEFAULT.URL = {};
DEFAULT.URL.platform = 'http://127.0.0.1:20000/';
DEFAULT.URL.market = 'http://127.0.0.1:20001/';
DEFAULT.URL.deploy = 'http://127.0.0.1:60000/';
DEFAULT.URL.build = 'http://127.0.0.1:50000/';
DEFAULT.URL.ide = 'http://127.0.0.1:40000/';
DEFAULT.URL.app = 'http://103.250.225.179:32001/';
DEFAULT.URL.proxy = '.devproxy.yunshipei.com';
DEFAULT.URL.cloud = '.cloud.yunshipei.com';
DEFAULT.URL.cdn = 'a.yunshipei.com';
DEFAULT.URL.devStatic = 'am.proxy.yunshipei.com';
DEFAULT.URL.beta = {
    'platform': 'http://127.0.0.1:20000/',
    'deploy': 'http://127.0.0.1:60000/',
    'build': 'http://127.0.0.1:50000/',
    'ide': 'http://127.0.0.1:40000/',
    'proxy': '.devproxy.yunshipei.com',
    'cloud': '.cloud.yunshipei.com',
    'cdn': 'a.yunshipei.com',
    'devStatic': 'am.proxy.yunshipei.com'
};

var betaConstants = {
    URL: {
        platform: 'http://platform.ysp.com/',
        market: 'http://market.ysp.com/',
        deploy: 'http://deploy.ysp.com/',
        build: 'http://build.ysp.com/',
        ide: 'http://ide.ysp.com/',
        proxy: '.devproxy.ysp.com',
        cloud: '.cloud.ysp.com',
        cdn: 'a.ysp.com',
        devStatic: 'am.proxy.ysp.com'
    }
};

var stagingConstants = {
    URL: {
        platform: 'http://platform.beta.yunshipei.com/',
        market: 'http://market.beta.yunshipei.com/',
        deploy: 'http://deploy.beta.yunshipei.com/',
        build: 'http://build.beta.yunshipei.com/',
        ide: 'http://ide.beta.yunshipei.com/',
        beta: {
            'platform': 'http://platform.beta.yunshipei.com/',
            'market': 'http://market.beta.yunshipei.com/',
            'deploy': 'http://deploy.beta.yunshipei.com/',
            'build': 'http://build.beta.yunshipei.com/',
            'ide': 'http://ide.beta.yunshipei.com/'
        }
    }
};

var productionConstants = {
    URL: {
        platform: 'http://platform.yunshipei.com/',
        market: 'http://market.yunshipei.com/',
        build: 'http://build.yunshipei.com/',
        ide: 'http://ide.yunshipei.com/',
        beta: {
            'platform': 'http://platform.beta.yunshipei.com/',
            'market': 'http://market.beta.yunshipei.com/',
            'deploy': 'http://deploy.beta.yunshipei.com/',
            'build': 'http://build.beta.yunshipei.com/',
            'ide': 'http://ide.beta.yunshipei.com/'
        }
    }
};

if (process.env.NODE_ENV === 'production') {
    DEFAULT = util.merge(DEFAULT, productionConstants);
    // console.log(process.env);
    /// beta constants
    switch (process.env.AM_VERSION) {
        case 'beta':
            {
                DEFAULT = util.merge(DEFAULT, betaConstants);
                break;
            }
        case 'staging':
            {
                DEFAULT = util.merge(DEFAULT, stagingConstants);
                break;
            }
    }
}