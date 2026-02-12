const io = require('socket.io')(3000, {
  cors: { origin: "*" } // Allows your HTML file to connect
});

let players = {};

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // When a player joins, save their data
    socket.on('join', (data) => {
        players[socket.id] = {
            id: socket.id,
            x: 400, y: 250,
            name: data.name,
            color: data.color,
            hat: data.hat,
            msg: "",
            msgTime: 0
        };
        io.emit('updatePositions', players);
    });

    // When a player moves, update the brain
socket.on('move', (data) => {
        if (players[socket.id]) {
            players[socket.id].x = data.x;
            players[socket.id].y = data.y;
            // Catch the chat message from the client
            players[socket.id].msg = data.msg || "";
            players[socket.id].msgTime = data.msgTime || 0;
            
            io.emit('updatePositions', players);
        }
    });

    socket.on('disconnect', () => {
        delete players[socket.id];
        io.emit('updatePositions', players);
    });
});

console.log('Server is running on port 3000');