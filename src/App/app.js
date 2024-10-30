import router from "../Controllers/Controller.js"
import express from "express";
import { createServer } from 'node:http';
import morgan from "morgan";
import { Server } from "socket.io";

const app = express();
const port = 3000;
const server = createServer(app);
const io = new Server(server);


app.use(morgan('dev'));

app.set('io', io);

app.use('/partie', router);

server.listen(port, () => {
    console.log(`Started app listening on port ${port}`)
});