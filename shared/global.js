exports.init = () => {
    global.constants = require('./constants.js'); 
    global.db = require('./db/manager.js');
    global.logger = require('./logger.js');
    global.expressExtentions = require('./http/expressExtentions.js');
    global.socketsWrapper = require('./http/socketsWrapper.js');
    global.webAppFacade = require('./http/webAppFacade.js');
    global.requestWrapper = require('./http/requestWrapper.js');
    global.environment = require('./environment.js');
}