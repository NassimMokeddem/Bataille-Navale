import router from "../Controllers/Controller.js"
import express from "express";
import { createServer } from 'node:http';
import morgan from "morgan";
import { Server } from "socket.io";
import { Socket} from '../Controllers/Socket.js';

const app = express();
const port = 3000;
const server = createServer(app);
const io = new Server(server);

app.use(morgan('dev'));
app.use('/partie', router);

io.on('connection', async (socket) =>{
    console.log(socket.id + ' connected');
    let sock = new Socket(socket, io);
});

app.listen(port, () => {
    console.log(`Started app listening on port ${port}`)
});
