var users = require('./users.js');
var jobs = require('./jobs.js');
var files = require('./files.js');

exports.init = (app) => {
    users.init(app);
    jobs.init(app);
    files.init(app);
}