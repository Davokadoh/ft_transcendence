const express = require('express');
const { createServer } = require('node:http');
//const { Server } = require('socket.io');
const { join } = require('path');
const cors = require('cors');

const app = express();
const server = createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        //methods: ["GET", "POST"]
    }
});

app.use(cors());
app.get('*', (req, res) => {
    console.log('le serveur est accessible');
    //res.sendFile(join(__dirname, '../../../../frontend/app/index.html'));
});

io.on('connection', (socket) => {
    
    //emit the anyone online
    console.log('********** ' + socket.id + ' ********');
    //manage chat
    socket.on('chat', (msg) => {
        socket.broadcast.emit('chat', msg);
        //
    });

    socket.on('channel_msg', (msg) => {});
    socket.on('channel_join', (msg) => {});
    socket.on('channel_left', (msg) => {});
    socket.on('channel_block', (target) => {});

    //socket.emit('chat message', inputField.value);

});


server.listen(3000, () => {
    console.log('Server is listening on port 3000');
});