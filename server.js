var express = require('express'),
    path = require('path'),
    logger = require('morgan'),
    //cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    http = require('http'),
    index = require('./routes/index'),
    app = express(),
    HotsLogApi = require('./HotsLogsApi'),
    LaMetricApi = require('./LaMetricApi');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function(req, res) {
    console.log("A la racine de l'app");
});

app.get('/getData', function(req, res) {
    console.log(req.query);
    HotsLogApi.getPlayerStats(req.headers, req.query, function(err, response, data) {
        if (err || response.statusCode != 200) {
            if (err) {
                console.log(err);
                return res.status(500).send(err)
            } else {
                return res.status(response.statusCode).send(response.body);
            }
        };

        var jsonResponse = LaMetricApi.buildResponse(req, data);

        if (!jsonResponse) {
            console.log("Error: ", response.statusCode);
            res.status(response.statusCode).send(response.body);
        } else {
            console.log("Response: ", jsonResponse);
            return res.status(200).json(jsonResponse);
        }
    })

});

app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app;