exports.init = () => {
    global.constants = require('./constants.js'); 
    global.db = require('./db/manager.js');
}