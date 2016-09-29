/**!
 * DNS test case
 * @author: larry / ll@yunshipei.com
 *
 * Copyright (c) 2014 Allmobilize Inc
 */

'use strict';

var assert = require("assert");
var dns = require('../dns');

describe('dns parser', function() {

    it('should convert api success', function(done) {
        dns.lookup('git.yunshipei.net').done(function(result){
            if(result.family === 4) {
                assert.equal(result.ip, '168.63.139.213');
            }
            done();
        }, done);
    });
});