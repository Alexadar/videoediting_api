var global = require('../shared/global.js');
var videoTrimJob = require('./jobs/videoTrimJob.js');
global.coolDown = false;
console.log("pm2 sendSignal SIGUSR1 'worker' - stop loop for safe shutdown");
Promise.race([
    global.init(),
    videoTrimJob.run()
]).then(() => console.log('Video api worker started. ')).catch(console.log);

process.on('SIGUSR1',  () => {
    global.cooldown = true;
    console.log("worker  -> cooling down");
});
