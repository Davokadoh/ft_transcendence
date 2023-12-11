
/* express creation web app & API: manage root, request, response*/
const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
/*equivalent to => import { Server } from "socket.io"  */
const { Server } = require('socket.io');

const app = express();

const server = createServer(app);
const io = new Server(server) //, { connectionStateRecovery: {} });

app.get('/', (req, res) => { 
    res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    //console.log('a user connected');
    socket.on('chat message', (msg) => {
        console.log(`socket id: ${socket.id}`);
        
        //broadcast emit on all socket
        io.emit('chat message', msg);
    });

    //socket.emit('serverEvent', { message: 'hello, client!' });
});

const port = 3000;
server.listen(port, () => {
    console.log(`server running at http://localhost:${port}`);
});
