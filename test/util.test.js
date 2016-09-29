/**!
 *
 * @author: larry / ll@yunshipei.com
 *
 * Copyright (c) 2014 Allmobilize Inc
 */

'use strict';

var fsModule = require('fs');
var assert = require("assert");
var Q = require('q');
var util = require('../').util;

var readFile = Q.denodeify(fsModule.readFile);

describe('util tests', function() {

    it('each limit', function(done) {

        var p = [];
        var len = 100;
        util.each(new Array(len), function() {
            p.push(readFile(__dirname + '/dns.test.js', {
                encoding: 'utf8'
            }));
        });
        util.eachLimit(p, 10).then(function(results) {
            assert.equal(len, results.length);
            done();
        }).done(null, done);
    });
});