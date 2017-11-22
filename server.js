var app = require('./app');
var debug = require('debug')('hots-logs:server');
var http = require('http');

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 3000
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

var server = http.createServer(app);

server.listen(server_port, server_ip_address, function() {
    console.log("Listening on " + server_ip_address + ", server_port " + server_port)
});