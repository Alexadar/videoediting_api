var ffmpeg = require('ffmpeg');

exports.run = function () {
    while (global.cooldown === false) {
        try {
            await(async () => {
                return new Promise(async (resolve, reject) => {
                    try {
                        var jobs = await global.db.jobs.getJobs(global.constants.jobTypes.trimJob, 1);
                        job = jobs[0];
                        if (!job) {
                            await resolve().delay(1000);
                        } else {

                        }
                    } catch (e) {
                        console.log(e);
                        resolve();
                    }
                });
            });
        } catch (e) {
            console.log(e);
        }
    }
    console.log('Video trim job cooled down');
}