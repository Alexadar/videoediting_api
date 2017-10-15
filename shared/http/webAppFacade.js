exports.sendMessage = function (message, error) {
    return global.requestWrapper.promisedRequestJson(global.environment.webFacadeOnTransactionPath, { data: message, error: error }).catch(console.log);
};
