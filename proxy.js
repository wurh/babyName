'use strict'

var httpProxy = require('http-proxy'),
proxy = httpProxy.createProxy();

module.exports = function(options) {
    return function(req, res, next) {
            // 构造GET请求参数
            var query = [];
            for (var item in req.query) {
                query.push(item + '=' + req.query[item]);
            }

            // 构造代理服务路径
            var reqOptions = {};
            if (typeof options === 'string') {
                reqOptions = { target: options, ignorePath: true };
                reqOptions.target = reqOptions.target + req.path + '?' + query.join('&');
            }
            console.log('ProxyUrl:' + reqOptions.target);
            proxy.web(req, res, reqOptions, function(err) {
                err.mod = 'proxy';
                next(err);
            });
    };
};
