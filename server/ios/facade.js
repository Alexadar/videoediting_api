var users = require('./users.js');
var jobs = require('./jobs.js');

exports.init = (app) => {
    users.init(app);
    jobs.init(app);
}