exports.init = (app) => {
    app.post('/api/notifyJob', function (req, res) {
        req.throwIfNonLocal();
        try {
            global.webSocketServer.sendTo(req.body.data.userId, "notifyJob", req.body);
        } catch (e) {
            res.processError(e);
        }
    });
}