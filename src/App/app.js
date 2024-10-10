import { Navire } from "../Models/Navire.js";
import { Plateau } from "../Models/Plateau.js";
import { Controller } from "../Controllers/Controller.js"
import express from "express";

const bateau = new Navire("Frégate");
console.log(bateau);


const monde = new Plateau(10, 10);
console.log(monde);

const app = express();
const port = 3000;

const controllerInstance = new Controller();

app.use('/partie', controllerInstance);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

//monde.setSpace(0, 0, bateau);

//console.log(monde.terrain);
