import { Case } from "./Case.js";

export class Plateau {
    constructor(nlong, nlarg){
        this.nlong = nlong;
        this.nlarg = nlarg;
        this.grille = this.initialiserGrille(nlarg, nlong);
    }

    initialiserGrille(nlong, nlarg){
        const grille = []
        for(i in nlong){
            const ligne = []
            for(j in nlarg){
                ligne.push(new Case(i, j));
            }

            grille.push(ligne);
        }

        return grille;
    }
/*
    setSpace(posx, posy, object){
        this.terrain[posx][posy] = object
    }

    isInWorld(posx, posy){
        return (posx >= 0) && (posx < this.nlong) && (posy >= 0) && (posy < this.nlarg)  
    }
*/
}