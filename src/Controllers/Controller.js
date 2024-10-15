import express from "express";
import Service from "../Services/Service.js"

const router = express.Router();
const service = new Service();

router.use(express.json());

router.get('/', (req, res) => {
    res.send('Hello World!\n')
})

router.get('/newNavire', (req, res) => {
    res.json(service.createNavire(req.query.type));
})

router.get('/startGame', (req, res) => {
    res.json(service.createPlateau(req.query.nlong, req.query.nlarg));
})

router.post('/startGame', (req, res) => {
    const { x, y, contenu } = req.body;

    try {
        service.updatePlateau(x, y, contenu);
        const plateau = service.getPlateau();
        res.json({ message: 'Map updated successfully', plateau });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.all('*', (req, res) => {
    res.sendStatus(404).end()
})

export default router;