/**!
 * CORS
 * @author: larry / ll@yunshipei.com
 *
 * Copyright (c) 2014 Allmobilize Inc
 */

'use strict';

function defaultValidation(req) {
    if (req.headers.origin) {
        return req.headers.origin.indexOf('.yunshipei.') !== -1;
    }
}

function defaultHandler(res) {
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
    res.setHeader('Access-Control-Allow-Credentials', true);
}

module.exports = function(options) {
    options = options || {};
    var validation = options.validation || defaultValidation;
    var handler = options.handler || defaultHandler;
    return function(req, res, next) {
        var valid = validation(req);
        if (valid) {
            if (req.headers['origin']) {
                res.setHeader('Access-Control-Allow-Origin', req.headers['origin']);
                handler(res);
            }
        }
        if (req.method === 'OPTIONS') {
            res.statusCode = 204;
            res.end();
        } else {
            next();
        }
    }
};