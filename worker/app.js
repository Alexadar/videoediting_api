console.log("pm2 sendSignal SIGUSR1 'worker' - stop loop for safe shutdown");
global.cooldown = false;
process.on('SIGUSR1',  () => {
    global.cooldown = true;
    console.log("worker  -> cooling down");
});

require('../shared/global.js').init()
.then(() => require('./jobs/videoTrimJob.js').run())
.then(() => console.log('Video api worker started. '))
.catch(console.log);
