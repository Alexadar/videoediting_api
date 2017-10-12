
require('../shared/global.js').init().then(() => {
    require('./webFacade.js').startServer({
        port: 15000,
        serveWebPages: true
    });
}).catch(console.log);