'use strict';

var meta = require('./package.json'),
    express = require('express'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    middleware = ['proxy'],
    cheerio = require('cheerio'),
    request = require('request'),
app = module.exports = express();

// lazy load middlewares
middleware.forEach(function (m) {
    middleware.__defineGetter__(m, function () {
        return require('./' + m);
    });
});

process.on('uncaughtException', function (err) {
    (app.get('logger') || console).error('Uncaught exception:\n', err.stack);
});

app.set('name', meta.name);
app.set('version', meta.version);
app.set('port', process.env.PORT || 3333);
app.set('views', path.join(__dirname, 'public', 'html'));
app.use(express.static(__dirname + '/public'));
app.set('logger', console);
app.enable('trust proxy');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use('/api/', middleware.proxy('http://www.sheup.com'));


// function tryGetPointByName(fn, name) {
//     fn = '吴';
//     name = '思颖';
//     var params = {
//         xs: fn,
//         mz: name
//     };
//     console.log(params);
//     request.post({url: 'http://www.xingming.com/dafen', form: params}, function (err, httpResponse, body) { /* ... */
//         console.log(body);
//
//     })
// }
//
// tryGetPointByName();


if (require.main === module) {
    app.listen(app.get('port'), function () {
        console.log('[%s] Express server listening on port %d',
            app.get('env').toUpperCase(), app.get('port'));
    });
}
