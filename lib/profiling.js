/**!
 * 性能分析
 * @author: larry / ll@yunshipei.com
 *
 * Copyright (c) 2014 Allmobilize Inc
 */

'use strict';

var argv = require('optimist').argv;

if (argv['_am_profiling']) {
    require('heapdump');
}