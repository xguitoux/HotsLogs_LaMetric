var request = require('request');
module.exports = {
    /**
     * Method: getData
     * @return json
     * returns Response called API method
     */
    getData: function(url, header, queryParams, callback) {
        // console.log("GET: ", url);
        // console.log("QS: ", queryParams);
        // console.log("Headers: ", header);

        request.get({
            url: url,
            qs: queryParams,
            headers: header,
            rejectUnauthorized: true,
        }, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                try {
                    callback(null, response, JSON.parse(body));
                } catch (err) {
                    callback(err, response);
                }
            } else {
                callback(error, response, null);
            }
        });
    },
    getPlayerStats: function(headers, parameters, callback) {

        var url = "https://api.hotslogs.com/Public/Players/" + parameters.PlayerID;

        var postHeader = {
            'User-Agent': headers.host,
            'Accept': 'application/json',
            'Authorization': headers.authorization // pass authorization header received in request
        };
        this.getData(url, postHeader, parameters, callback);

    },
}