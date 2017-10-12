var encryptor = require('simple-encryptor')(global.constants.userTokenKey);

exports.init = (app) => {
    app.post('/api/login', async (req, res) => {
        try {
            //assuming login process compleeted
            var userId = req.userId;
            var accessToken = encryptor.encrypt(userId);
            var user = await global.db.users.getUser(userId);
            if(!user) {
                var user = {
                    id: userId
                }
                //todo: one at time
                user = await global.db.users.createUser(user);
            }   
            user.accessToken = accessToken;
            var publicInitObject = {
                user: user,
                constants: global.constants.client,
                jobs: await global.db.getUsersJobsList(req.userId)
            }     
            return res.processResponse(publicInitObject);
        } catch (e) {
            res.processError(e);
        }
    });
}