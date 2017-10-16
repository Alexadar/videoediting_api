var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');

var app = express();
var server = http.createServer(app);
var clientRoot = __dirname + '/../testClient';
var videosRoot = __dirname + '/../files/done';
var iosFacade = require('./ios/facade.js');
var generalFacade = require('./general/facade.js');

var options = {};

var initApp = () => {
    app.use(bodyParser.json());
    app.use(global.expressExtentions.extentions);
    app.use(global.expressExtentions.errorHandler);
};

var initApi = () => {
    iosFacade.init(app);
    generalFacade.init(app);
};

var initRoutes = () => {
    if (options.serveWebPages === true) {
        app.use('/', express.static(clientRoot + '/'));
        app.use('/videos', express.static(videosRoot + '/'));
    }

    app.get('*', (req, res) => {
        res.status(404).send('Resource not found');
    });
};

exports.startServer = (optionsArgs) => {
    options = optionsArgs;
    initApp();
    initApi();
    initRoutes();
    global.webSocketServer = global.socketsWrapper.initSocketServer(server);
    server.listen(global.environment.apiPort);
    console.log(`Video api started on port ${global.environment.apiPort}`);
    console.log(`Go to http://localhost:${global.environment.apiPort} for test client`);
};