var request = require("request"),
    _ = require('lodash'),
    async = require("async");
var CONFIG = {
    client_id: "10293",
    client_secret: "34dcf7b1671d32ed9346ef8717c6fceffc48aa2a",
    username: "yunshipei",
    password: "allmobilize@2013"
};

var Up = function(config) {
    this.config = config || CONFIG;
    this.init();
};

// Up.config = config;

Up.prototype.init = function() {
    // init不成功时, 也可以进行下面的操作
    this.getAccessToken(function(err, access_token) {
        if (err) return console.log(err);
        //        console.log(access_token);
    });
};

Up.prototype.createBucketsBySite = function(site, cb) {
    if (!site || !site.vas || !site.vas.upyun || !site.vas.upyun.bucket_name) return cb();
    return this.createBuckets({
        bucket_name: site.vas.upyun.bucket_name
    }, cb);
};

// 每次 request 都会 check token
Up.prototype.getAccessToken = function(cb) {
    var self = this;
    request.post({
        url: "https://api.upyun.com/oauth/access_token/",
        form: {
            client_id: self.config.client_id,
            client_secret: self.config.client_secret,
            username: self.config.username,
            password: self.config.password,
            grant_type: "password"
        },
        json: true
    }, function(e, r, b) {
        if (!e && r.statusCode == 200 && b) {
            self.access_token = b.access_token;
            self.expires_time = new Date((new Date()).getTime() + b.expires_in * 1000);
            return cb(0, self.access_token);
        }
        if (e) return cb("getAccessToken error: " + e);
        cb("getAccessToken error, statusCode: " + r.statusCode);
    });
};

Up.prototype.createBuckets = function(options, cb) {
    var self = this;
    // console.log(options.bucket_name);
    async.auto({
        creat: function(callback) {
            self.request({
                url: "https://api.upyun.com/buckets/",
                method: "PUT",
                form: {
                    type: "cdn",
                    bucket_name: options.bucket_name
                }
            }, callback);
        },
        setOrigin: ["creat",
            function(callback) {
                self.request({
                    url: "https://api.upyun.com/buckets/cdn/",
                    method: "POST",
                    form: {
                        domain: "fetcher.upyun.com",
                        ip_tel: "60.190.168.149",
                        bucket_name: options.bucket_name
                    }
                }, callback);
            }
        ],
        setDomain: ["creat",
            function(callback) {
                async.parallel([

                    function(cb) {
                        self.request({
                            url: "https://api.upyun.com/buckets/domain/",
                            method: "PUT",
                            form: {
                                domain: options.bucket_name + ".yunshipei.cn",
                                bucket_name: options.bucket_name
                            }
                        }, cb);
                    },
                    function(cb) {
                        self.request({
                            url: "https://api.upyun.com/buckets/domain/",
                            method: "PUT",
                            form: {
                                domain: "*." + options.bucket_name + ".yunshipei.cn",
                                bucket_name: options.bucket_name
                            }
                        }, cb);
                    }
                ], callback);
            }
        ]
    }, cb);
};

Up.prototype.bucketsStat = function(options, cb) {
    var self = this;
    self.request({
        url: "https://api.upyun.com/stats/",
        method: "GET",
        qs: {
            bucket_name: options.bucket_name,
            period: options.period,
            start_day: options.start_day
        }
    }, cb);
};

Up.prototype.changeVisible = function(options, cb) {
    var self = this;
    self.request({
        url: "https://api.upyun.com/buckets/visible/",
        method: "POST",
        form: {
            bucket_name: options.bucket_name,
            visible: options.visible
        }
    }, cb);
};

Up.prototype.refreshCache = function(options, cb) {
    var self = this;
    // console.log(options.files);
    // var files = (options.files);
    var urls = "";
    /*
        POST /modules/upyun/refresh

        form-data; name="files"  ["x","y","z","2222"]
        form-data; name="siteID" ysp
      */
    _.each(options.files, function(file) {
        // console.log(file);
        urls = urls + "http://yspstore.b0.upaiyun.com/" + options.siteID + "/" + file + "\n";
        urls = urls + "http://a.yunshipei.com/" + options.siteID + "/" + file + "\n";
    });
    self.request({
        url: "https://api.upyun.com/purge/",
        method: "POST",
        form: {
            urls: urls
        }
    }, cb);
};

Up.prototype.request = function(obj, callback) {
    var self = this;
    obj.json = true;

    async.auto({
        checkAccessToken: function(cb) {
            if (new Date() >= self.expires_time) {
                self.getAccessToken(cb);
            } else {
                cb(0, self.access_token);
            }
        },
        request: ["checkAccessToken",
            function(cb, results) {

                obj.headers = {
                    "Authorization": "Bearer " + results.checkAccessToken
                };

                request(obj, function(e, r, b) {
                    if (!e && b) {
                        cb(0, b);
                    } else {
                        if (e) return cb(e);
                        if (r) return cb("statusCode: " + r.statusCode);
                    }
                });
            }
        ]
    }, function(err, results) {
        callback(err, results.request);
    });
};

exports = module.exports = Up;