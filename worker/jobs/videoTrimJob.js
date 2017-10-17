var ffmpeg = require('ffmpeg');

var doWork = async () => {
    try {
        if (global.cooldown === false) {
            await global.utils.timeout(1000);
            var jobs = await global.db.jobs.getJobs(global.constants.jobTypes.trimJob, 1);
            if (jobs.length) {
                job = jobs[0];
                console.log(`Job ${job._id} processing`);
                //testing
                if(job.userId === 'luckyStrike') {
                    var rand = Math.random();
                    if(rand < 0.7) {
                        var jobState = global.constants.jobStates.failed;
                        var jobMessageType = global.constants.jobMessageTypes.jobFailed;
                        if(rand < 0.3){
                            jobState = global.constants.jobStates.rerunable;
                            jobMessageType = global.constants.jobMessageTypes.jobFailedRerunable;
                        }
                        job.state = jobState;
                        await global.db.jobs.updateJob(job);
                        global.webAppFacade.sendMessage({
                            userId: job.userId,
                            jobMessageType: jobMessageType,
                            job: job
                        });
                        return doWork();
                    }
                }
                //testing
                if (!job.data.path || !job.data.trimStart || !job.data.trimEnd) {
                    job.state = global.constants.jobStates.failed;
                    await global.db.jobs.updateJob(job);
                    global.webAppFacade.sendMessage({
                        userId: job.userId,
                        jobMessageType: global.constants.jobMessageTypes.jobFailed,
                        job: job
                    });
                    console.log(`Job ${job._id} broken`);
                } else {
                    job.state = global.constants.jobStates.pending;
                    await global.db.jobs.updateJob(job);
                    ffmpeg(job.data.path).then(async function (video) {
                        try {
                            // No time to code, guys i hardcode here MP4 but if needed can be changed
                            video.setVideoStartTime(job.data.trimStart)
                                .setVideoDuration(job.data.trimEnd - job.data.trimStart)
                                .addCommand('-f', 'mp4');
                            await video.save(`../files/done/${job._id}.mp4`);
                            job.state = global.constants.jobStates.completed;
                            job.data.resultFile = `/videos/${job._id}.mp4`;
                            await global.db.jobs.updateJob(job);
                            global.webAppFacade.sendMessage({
                                userId: job.userId,
                                jobMessageType: global.constants.jobMessageTypes.jobCompleted,
                                job: job
                            });
                            console.log(`Job ${job._id} completed`);
                        } catch (err) {
                            job.state = global.constants.jobStates.rerunable;
                            await global.db.jobs.updateJob(job);
                            global.webAppFacade.sendMessage({
                                userId: job.userId,
                                jobMessageType: global.constants.jobMessageTypes.jobFailedRerunable,
                                job: job
                            });
                            console.log(err);
                            console.log(`Job ${job._id} failed`);
                        }
                    });
                }
            }
            doWork();
        } else {
            console.log("Trim job stopped");
        }
    } catch (e) {
        console.log(e);
    }
}

exports.run = function () {
    doWork();
}