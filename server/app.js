try {
    var global = require('../shared/global.js');
    var webFacade = require('./webFacade.js');
    global.init();
    webFacade.startServer({
        port: 15000,
        serveWebPages: true
    });
} catch (error) {
    console.log(error);
    process.exit();
}