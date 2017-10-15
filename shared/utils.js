exports.createError = (userId, errorCode, message, errorData) => {
    if (message) {
        message = ", " + message;
    } else {
        message = "";
    }
    var string = `userId ${userId} got error code ${errorCode} ${message}`;
    var error = new Error(string);
    error.message = string;
    error.error = {
        code: errorCode
    };
    if (errorData) {
        error.error.errorData = errorData;
    }
    return error;
};

exports.timeout = (interval) => {
    return new Promise(resolve => setTimeout(resolve, interval));
}
