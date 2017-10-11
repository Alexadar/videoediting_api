exports.extentions = (req, res, next) => {
    req.throwIfNonLocal = function () {
        if (req.connection.remoteAddress != "127.0.0.1" &&
            req.connection.remoteAddress != "::ffff:127.0.0.1" &&
            req.connection.remoteAddress != "::1") {
            throw "Non local request detected";
        }
    };

    req.throwIfNotAuthorized = () => {
        if (!req.userId) {
            throw global.helpers.createError("", global.constants.errorCodes.notAuthorized);
        }
    };

    res.processError = (err) => {
        global.logger.catchHandler(err);
        var code = global.settingsWrapper.errorCodes.internalServerError;
        var errorData = null;
        if (err && err.error) {
            code = err.error.code || code;
            errorData = err.error.errorData;
        }
        global.webResponse.respondWithError(res, code, null, errorData);
    };

    res.createResponse = (data) => {
        global.webResponse.createResponseAndSend(res, data);
    };

    return next();
}

exports.errorHandler = (err, req, res, next) => {
    global.logger.catchHandler(err);
    res.status(500);
    res.end('Internal server error');
}