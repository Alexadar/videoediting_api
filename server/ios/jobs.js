exports.init = (app) => {
    app.post('/api/notifyJob', function (req, res) {
        req.throwIfNonLocal();
        try {
            global.webSocketServer.sendTo(req.body.data.userId, "notifyJob", req.body);
        } catch (e) {
            res.processError(e);
        }
    });

    app.post('/api/createJob', async (req, res) => {
        try {
            req.throwIfNotAuthorized();
        } catch (e) {
            res.processError(e);
        }
    });

    app.get('/api/getJobList', async (req, res) => {
        try {
            req.throwIfNotAuthorized();
            var jobList = global.db.jobs.getUsersJobsList(req.userId);
            return res.createResponse(jobList);
        } catch (e) {
            res.processError(e);
        }
    });

    app.get('/api/updateJob', async (req, res) => {
        try {
            req.throwIfNotAuthorized();
            var job = global.db.jobs.getJob(req.body.jobId);
            if (job.userId !== req.userId) {
                throw global.utils.createError(req.userId, global.constants.errorCodes.notAuthorized);
            }
            switch (req.body.state) {
                case global.constants.jobStates.created:
                    if (job.state === global.constants.jobStates.failed) {
                        job.state = global.constants.jobStates.created;
                        job = await global.db.jobs.updateJob(job);
                    }
                    else {
                        throw global.utils.createError(req.userId, global.constants.errorCodes.general);
                    }
                    break;
                default:
                    throw global.utils.createError(req.userId, global.constants.errorCodes.notAuthorized);
                    break;
            }
            res.processResponce(job);
        } catch (e) {
            res.processError(e);
        }
    });

}