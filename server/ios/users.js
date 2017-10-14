var encryptor = require('simple-encryptor')(global.constants.userTokenKey);

exports.init = (app) => {
    app.post('/api/login', async (req, res) => {
        try {
            //assuming login process compleeted
            var userId = req.body.userId;
            var accessToken = encryptor.encrypt(userId);
            var user = await global.db.users.getUser(userId);
            if (!user) {
                var user = {
                    userId: userId,
                    jobs: []
                }
                //todo: one at time
                await global.db.users.createUser(user);
            } else {
                user.jobs = await global.db.jobs.getUsersJobsList(userId);
            }
            user.accessHeaders = [
                {
                    accessToken: accessToken
                }
            ]
            var publicInitObject = {
                user: user,
                constants: global.constants.client
            }
            return res.createResponse(publicInitObject);
        } catch (e) {
            res.processError(e);
        }
    });
}