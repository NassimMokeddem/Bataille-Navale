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

router.post('/startGame', (req, res) => {
    res.json(service.createPlateau(req.query.nlong, req.query.nlarg));
})

router.put('/putNewBoat', (req, res) => {
    const {x, y, contenu} = req.query;

    if (x === undefined || y === undefined || contenu === undefined)
        res.status(400).send({ error: 'Format des données non reconnu.' }).end();

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
            res.status(400).send({ error: 'Mauvais type de navire.' }).end();
    }
    const plateau = service.getPlateau();

    res.json({ message: 'Map updated successfully', plateau });
})


/*
*  TO DO
*  modifier les données à recevoir:
*  requête body -> Navire attaquant, Navire defenseur, Case attaquant, Case Defenseur
*  
*  modifier l'appel de service pour utiliser service.tirer
*/
router.put('/tirer', (req,res) => {
    const { x1, y1, x2, y2 } = req.query;

    if (x1 === undefined || y1 === undefined ||
        x2 === undefined || y2 === undefined
    )
    res.status(400).send({ error: 'Format des données non reconnu.' }).end();

    const plateau = service.getPlateau();
    service.applyShot(x1, y1, x2, y2, res, plateau);
})

router.all('*', (req, res) => {
    res.sendStatus(404).end()
})

export default router;