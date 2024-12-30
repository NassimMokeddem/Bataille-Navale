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

app.set("view engine", "ejs");
app.set("views", "./src/ClientSide");

app.use(express.static("public"))
app.use(express.static("src/ClientSide"))
app.use('/', router);


server.listen(port, () => {
    console.log(`Started app listening on port ${port}`)
});