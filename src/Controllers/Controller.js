import express from "express";
import Service from "../Services/Service.js"
import { Destroyer, Fregate, SousMarin } from "../Models/Navire.js";

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
    if (req.body.contenu !== undefined) { // Ajouter un bateau
        const { x, y, contenu } = req.body;
        
        switch(contenu){
            case "Destroyer":
                service.updatePlateau(x, y, new Destroyer());
                break;
            case "SousMarin":
                service.updatePlateau(x, y, new SousMarin());
                break;
            case "Fregate":
                service.updatePlateau(x, y, new Fregate());
                break;
            default:
        }
        const plateau = service.getPlateau();
        res.json({ message: 'Map updated successfully', plateau });
    } 
    else if (req.body.x1 !== undefined && req.body.x2 !== undefined) { // Tirer
        const { x1, y1, x2, y2 } = req.body;
        const plateau = service.getPlateau();
        service.applyShot(x1, y1, x2, y2, res, plateau);
    }
    else {
        res.status(400).send({ error: 'Format des données non reconnu.' });
    }
    /*
    try {
        switch(contenu){
            case "Destroyer":
                service.updatePlateau(x, y, new Destroyer());
                break;
            case "SousMarin":
                service.updatePlateau(x, y, new SousMarin());
                break;
            case "Fregate":
                service.updatePlateau(x, y, new Fregate());
                break;
            default:
        }
        const plateau = service.getPlateau();
        res.json({ message: 'Map updated successfully', plateau });
    
    } catch (error) {
        res.status(400).json({ message: error.message });
    }*/
})

router.all('*', (req, res) => {
    res.sendStatus(404).end()
})

export default router;