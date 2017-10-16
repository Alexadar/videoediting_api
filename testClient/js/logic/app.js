var app = angular.module("videoapi_app", []);

app.factory('apiLayer', function ($q) {
    return {
        apiGetCall: function (url, data) {
            return this.apiCall("GET", url, data);
        },

        apiPostCall: function (url, data) {
            return this.apiCall("POST", url, data);
        },

        apiFormDataCall: function (url, data) {
            return this.apiCall("POST", url, data, true);
        },

        apiCall: function (type, url, data, isMultiPart) {
            var sendData = null;
            if (data) {
                if (!isMultiPart) {
                    sendData = JSON.stringify(data.body)
                } else {
                    //assuming form data formed above
                    sendData = data.body
                }
            }
            var deferred = $q.defer();
            var options = {
                type: type,
                url: url,
                beforeSend: function (request) {
                    if (data && data.headers) {
                        data.headers.forEach(function (obj) {
                            for (var propertyName in obj) {
                                request.setRequestHeader(propertyName, obj[propertyName]);
                            }
                        });
                    }
                },
                data: sendData,
                contentType: isMultiPart ? false : (sendData ? "application/json" : ""),
                processData: isMultiPart ? false : undefined,
                success: function (response) {
                    if (response.error && response.error.code) {
                        deferred.reject(response);
                    } else {
                        deferred.resolve(response);
                    }

                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    var err = {
                        error: {
                            code: 1
                        }
                    };
                    deferred.reject(err);
                }
            };
            $.ajax(options);
            return deferred.promise;
        }
    };
});

app.factory('socket', function ($rootScope) {
    var socket = null;
    return {
        connect: function (url, query) {
            socket = io(url, {
                path: "/ws",
                query: query
            });
            return this;
        },
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            });
        }
    };
});
