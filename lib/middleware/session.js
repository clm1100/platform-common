/**!
 * Session Support
 * @author: larry / ll@yunshipei.com
 *
 * Copyright (c) 2013 Allmobilize Inc
 */

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

module.exports = function(express, app, options) {
    // Cookie Setting
    options.cookie = options.cookie || {
            path: "/",
            domain: ".yunshipei.com",
            expires: 14 * 24 * 60 * 60 * 1000
        };

    var loadModel = require('platform-model').loadModel;
    var Admin = loadModel('account.Admin');
    var User = loadModel('account.User');

    var MongoStore = require('connect-mongo')(express);
    var store = new MongoStore({
        db: options.connection.db
    });
    // var SessionStore = require("session-mongoose")(express);
    // var store = new SessionStore({
    // 	connection: options.connection,
    // 	modelName: 'Session',
    // 	sweeper: false,
    // 	//interval: 120000, // expiration check worker run interval in millisec (default: 60000)
    // 	ttl: 15 // 这里设置的不管用. 需要去platform-model schema中的session 设置, 但此处不能删除.
    // });

    app.use(express.session({
        secret: options.secret || 'PLATFORM',
        store: store,
        cookie: options.cookie,
        key: options.key || 'platform_sid'
    }));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findOne('_id', id).then(function(found) {
            if (found) {
                return found;
            } else {
                return Admin.findOne('_id', id);
            }
        }).done(function(user) {
            done(null, user);
        }, done);
    });
    app.use(passport.initialize());
    app.use(passport.session());

    app.authenticate = function(options) {
        options.strategy = options.strategy || 'local';
        options.method = options.method || 'POST';
        passport.use(new LocalStrategy(options.setting, options.setting.callback));
        app[options.method.toLowerCase()](options.url, passport.authenticate(options.strategy, {
            failureRedirect: options.failureRedirect,
            failureFlash: options.failureFlash,
            badRequestMessage: options.badRequestMessage
        }), options.handler);
    };
};

module.exports.TYPE = {
    MONGODB: 1
};