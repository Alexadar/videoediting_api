var multer = require('multer');
var upload = multer({ dest: '../files/raw' });

exports.init = (app) => {

    app.post('/api/ios/1/createFileTrimJob', upload.single('trimFileUpload'), async (req, res) => {
        try {
            //todo: check inputs
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

    app.post('/api/ios/1/updateJob', async (req, res) => {
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