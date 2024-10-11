import express from "express";
import Service from "../Services/Service.js";

const router = express.Router();
const service = new Service();

router.get('/', (req, res) => {
    res.send('Hello World!\n')
})

router.get('/newNavire', (req, res) => {
    res.json(service.createNavire(req.query.type));
})

router.get('/startGame', (req, res) => {
    res.json(service.createPlateau(req.query.nlong, req.query.nlarg));
})

router.all('*', (req, res) => {
    res.sendStatus(404).end()
})

export default router;