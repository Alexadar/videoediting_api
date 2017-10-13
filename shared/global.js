exports.init = async () => {
    // very important
    process.on('unhandledRejection', (reason, p) => {
        console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
        throw new Error();
    });

    global.constants = require('./constants.js'); 
    global.environment = require('./environment.js');
    global.db = require('./db/manager.js');
    global.logger = require('./logger.js');
    global.expressExtentions = require('./http/expressExtentions.js');
    global.socketsWrapper = require('./http/socketsWrapper.js');
    global.webAppFacade = require('./http/webAppFacade.js');
    global.requestWrapper = require('./http/requestWrapper.js');
    global.webResponse = require('./http/webResponse.js');
    await global.db.init();    
}