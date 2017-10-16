var io;
var encryptor = require('simple-encryptor')(global.constants.userTokenKey);

exports.close = function() {
    for (var i = 0; i < io.sockets.length; i++) {
        io.sockets[i].disconnect(true);
    }
};

exports.initSocketServer = function(server) {

    io = require('socket.io')(server, {
        path: '/ws',
        pingTimeout: 8000,
        pingInterval: 3500
    });

    io.set('transports', ['websocket', 'polling']);

    io.clients = [];

    io.findSocketByUserId = function(userId) {
        for (var i = 0; i < io.clients.length; i++) {
            if (io.clients[i].userId == userId) {
                return i;
            }
        }
        return -1;
    };

    io.sendTo = function(userId, channel, message) {
        var clientId = io.findSocketByUserId(userId);
        if (clientId > -1) {
            var client = io.clients[clientId];
            for (var i = 0; i < io.clients[clientId].sockets.length; i++) {
                io.clients[clientId].sockets[i].emit(channel, message);
            }
        }
    };

    io.on('connection', function(socket) {
        try {
            if (socket.request._query[global.constants.apiAuthHeader]) {
                var authString = decodeURIComponent(socket.request._query[global.constants.apiAuthHeader]);
                if (authString) {
                    socket.userId = encryptor.decrypt(authString);
                }
            }
            if (socket.userId) {
                var clientId = io.findSocketByUserId(socket.userId);
                if (clientId == -1) {
                    io.clients.push({
                        userId: socket.userId,
                        sockets: [socket]
                    });
                } else {
                    io.clients[clientId].sockets.push(socket);
                }
            } else {
                socket.disconnect(true);
                return;
            }

            socket.on('disconnect', function() {
                try {
                    var userId = socket.userId;
                    if (userId) {
                        var index = io.findSocketByUserId(userId);
                        if (index > -1) {
                            var client = io.clients[index];
                            if (client.sockets.length < 2) {
                                io.clients.splice(index, 1);
                            } else {
                                var socketIndex = -1;
                                for (var i = 0; i < client.sockets.length; i++) {
                                    if (client.sockets[i].id == socket.id) {
                                        socketIndex = i;
                                    }
                                }
                                client.sockets.splice(socketIndex, 1);
                            }
                        }
                    }
                } catch (e) {
                    global.logger.catchHandler(e);
                }
            });
        } catch (e) {
            global.logger.catchHandler(e);
        }
    });

    return io;
};
