const handleConnection = (socket) => {
    console.log('a user connected');
    console.log('session ID:', socket.handshake.sessionID);

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
}

module.exports = {
    handleConnection
};