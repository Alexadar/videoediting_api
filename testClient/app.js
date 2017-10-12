var app = angular.module("videoapi_app", []);

app.factory('apiLayer', function($q) {
    return {
        apiGetCall: function(url, data) {
            return this.apiCall("GET", url, data);
        },

        apiPostCall: function(url, data) {
            return this.apiCall("POST", url, data);
        },

        apiCall: function(type, url, data) {
            var deferred = $q.defer();
            $.ajax({
                type: type,
                url: url,
                headers: data.headers,
                data: data.body ? JSON.stringify(data.body) : null,
                contentType: data ? "application/json" : "",
                success: function(response) {
                    if (response.error && response.error.code) {
                        deferred.reject(response);
                    } else {
                        deferred.resolve(response);
                    }

                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    var err = {
                        error: {
                            code: 1
                        }
                    };
                    deferred.reject(err);
                }
            });
            return deferred.promise;
        }
    };
});

app.factory('socket', function($rootScope) {
    var socket = null;
    return {
        connect: function(url) {
            socket = io(url, {
                path: "/ws"
            });
        },
        on: function(eventName, callback) {
            socket.on(eventName, function() {
                var args = arguments;
                $rootScope.$apply(function() {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function(eventName, data, callback) {
            socket.emit(eventName, data, function() {
                var args = arguments;
                $rootScope.$apply(function() {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            });
        }
    };
});
