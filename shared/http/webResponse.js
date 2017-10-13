function respondWithError(res, errorCode, errorMessage, errorData) {
    if (!errorCode) {
        errorCode = global.constants.general;
    }
    var responce = createResponse(null, errorCode, errorMessage, errorData);
    res.json(responce);
}

function createResponse(data, errorCode, errorMessage, errorData) {
    var response = {
        data: data,
        error: {
            code: errorCode,
            errorData: errorData,
            message: errorMessage
        }
    };
    return response;
}

function createResponseAndSend(res, data, errorCode, error) {
    var response = createResponse(data, errorCode, error);
    res.json(response);
}

var exports = module.exports;

exports.createResponseAndSend = createResponseAndSend;
exports.createResponse = createResponse;
exports.respondWithError = respondWithError;
