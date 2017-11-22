var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var HotsLogApi = require('./HotsLogsApi.js')



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
        // Building object for LaMetric. We will return it
        var responseObj = {};
        responseObj.frames = [];

        index = 0;


        var leagues = req.query.leagues.split(',');
        var spaceLessLeagues = [];
        // Removing white spaces
        leagues.forEach(element => {

            element = element.replace(/\s+/g, '');
            spaceLessLeagues.push(element);
        });

        data.LeaderboardRankings.forEach(element => {

            if (spaceLessLeagues.indexOf(element.GameMode) >= 0) {

                var frame = {
                    'index': index,
                    'text': element.GameMode,
                    'icon': 'i280',
                };
                index++;

                switch (element.LeagueID) {
                    case 0:
                        frame.icon = "i635"; // Master icon
                        break;
                    case 1:
                        frame.icon = "i5273"; // Diams icon
                        break;
                    case 2:
                        frame.icon = "i5271"; // Plat icon
                        break;
                    case 3:
                        frame.icon = "i5274"; // Gold icon
                        break;
                    case 4:
                        frame.icon = "i5270"; // Silver icon
                        break;
                    case 5:
                        frame.icon = "i5269"; // Bronze icon
                        break;
                }
                responseObj.frames.push(frame);
            }
        });


        console.log(responseObj);

        if (!data) {
            console.log("Error: ", response.statusCode);
            res.status(response.statusCode).send(response.body);
        } else {
            console.log("Response: ", responseObj);
            return res.status(200).json(responseObj);
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

module.exports = app;