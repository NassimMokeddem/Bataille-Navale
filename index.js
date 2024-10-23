import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';

import { Joueur } from './app.js';

const app = express();
const server = createServer(app);
const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get('/', (req, res) =>{
    res.sendFile(join(__dirname, 'front_test/index.html'));
});

io.on('connection', async (socket) => {
    console.log(socket.id + ' connected ');

    let player = new Joueur (socket, io);
});

server.listen(8080, () => {
    console.log('server running at http://localhost:8080');
});

