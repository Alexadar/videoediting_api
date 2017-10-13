var request = require('request');

var promisedRequest = (httpUrl, options) => {

    return new Promise(async (resolve, reject) => {
        try {
            if (!options) {
                options = {
                    uri: httpUrl,
                    method: "GET"
                };
            } else {
                options.uri = httpUrl;
            }

            request(options, function (error, response, body) {
                try {
                    if (!error) {
                        if (response.statusCode != 200) {
                            var errorResult = {};
                            errorResult.statusCode = response.statusCode;
                            errorResult.message = "Status code for request " + httpUrl + " was " + response.statusCode;
                            reject(errorResult);
                        } else {
                            resolve(body);
                        }
                    } else {
                        reject(error);
                    }
                } catch (e) {
                    reject(e);
                }

            });

            resolve();
        } catch (e) {
            reject(e);
        }
    });

};

exports.promisedRequest = promisedRequest;

exports.promisedRequestJson = async (httpUrl, postData) => {

    return new Promise(async (resolve, reject) => {
        try {
            var options = null;
            if (postData !== undefined) {
                options = {
                    uri: httpUrl,
                    json: true,
                    body: postData,
                    method: 'POST'
                };
            }
            var data = await promisedRequest(httpUrl, options, false);
            try {
                var dataType = typeof data;
                var parsedData = dataType == "string" ? JSON.parse(data) : data;
                resolve(parsedData);
            } catch (e) {
                console.log("Failed to parse to JSON: " + data + " from " + httpUrl);
                reject(e);
            }
            return deferred.promise;
        } catch (e) {
            reject(e);
        }
    });
};