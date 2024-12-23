import express from "express";
import Service from "../Services/Service.js"
import { Destroyer, Fregate, SousMarin } from "../Models/Navire.js";
import { dirname, join } from "node:path";
import { fileURLToPath } from 'node:url';
import { Socket } from "./Socket.js";

const router = express.Router();
const service = new Service();

const __dirname = dirname(fileURLToPath(import.meta.url));

router.use(express.json());

router.get('/', (req, res) => {
    res.send('Hello World!\n')
})

router.get('/start', (req, res) => {
    res.render('client', {});
    const io = req.app.get('io');
        io.on('connection', (socket) =>{
            let player = {socket: socket, partieID: null};
            socket.on('newGame', (partieID) => new Socket(player, partieID));
            socket.on('joinGame', (partieID) => Socket.joinPartie(player, partieID));
        });
})

router.all('*', (req, res) => {
    res.sendStatus(404).end()
})

export default router;