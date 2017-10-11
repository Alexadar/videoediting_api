var io;

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
            socket.request.cookies = cookie.parse(socket.request.headers.cookie);
            var userId = Number(userWrapper.getSteamId(socket.request));
            if (userId) {
                socket.userId = userId;
                var clientId = io.findSocketBySteamId(userId);
                if (clientId == -1) {
                    io.clients.push({
                        userId: userId,
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
                        var index = io.findSocketBySteamId(userId);
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
                    global.logger.error(e);
                }
            });
        } catch (e) {
            global.logger.error(e);
        }
    });

    io.use(function(socket, next) {
        try {
            if (socket.request.headers) {
                var id = global.userWrapper.getUserId(socket.request);
                if (id) {
                    return next();
                }
            }
            return next(new Error('Authentication error'));
        } catch (e) {
            global.logger.error(e);
            return next(new Error('Authentication error'));
        }
    });

    return io;
};
