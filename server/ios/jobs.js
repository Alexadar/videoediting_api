var multer = require('multer');
var upload = multer({ dest: '../files/raw' });
var path = require('path');
var fs = require('fs');
var util = require('util');

exports.init = (app) => {
    //todo: put on glob level
    app.post('/api/notifyJob', function (req, res) {
        req.throwIfNonLocal();
        try {
            global.webSocketServer.sendTo(req.body.data.userId, "notifyJob", req.body);
        } catch (e) {
            res.processError(e);
        }
    });

    app.post('/api/createFileTrimJob', upload.single('trimFileUpload'), async (req, res) => {
        try {
            req.throwIfNotAuthorized();
            var job = {
                type: global.constants.jobTypes.trimJob,
                state: global.constants.jobStates.created,
                createDate: (new Date()).getTime(),
                updateDate: (new Date()).getTime(),
                data: {
                    path: req.file.path,
                    name: req.body.name,
                    trimStart: req.body.trimStart,
                    trimEnd: req.body.trimEnd
                },
                userId: req.userId
            }
            await global.db.jobs.addJob(job);
            return res.createResponse(job);
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

    app.post('/api/updateJob', async (req, res) => {
        try {
            req.throwIfNotAuthorized();
            var job = await global.db.jobs.getJob(req.body._id);
            if (job.userId !== req.userId) {
                throw global.utils.createError(req.userId, global.constants.errorCodes.notAuthorized);
            }
            switch (req.body.state) {
                case global.constants.jobStates.created:
                    if (job.state === global.constants.jobStates.rerunable) {
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
            res.createResponse(job);
        } catch (e) {
            res.processError(e);
        }
    });

}