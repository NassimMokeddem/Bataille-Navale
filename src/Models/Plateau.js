import Case from "./Case.js";

export default class Plateau {
    constructor(nlong, nlarg) {
        this.nlong = nlong;
        this.nlarg = nlarg;
        this.grille = this.initialiserGrille(nlarg, nlong);
    }
    initialiserGrille(nlong, nlarg){
        const grille = new Array();
        for(let i=0; i < nlong; i++){
            const ligne = new Array();
            for(let j=0; j < nlarg; j++){
                ligne.push(new Case(i, j));
            }

            grille.push(ligne);
        }

        return grille;
    }

    getCase(x, y) {
        if (x >= 0 && x < this.nlong && y >= 0 && y < this.nlarg) {
            return this.grille[x][y];
        } else {
            throw new Error("Invalid coordinates");
        }
    }

    setCaseContent(x, y, contenu) {
        if (x >= 0 && x < this.nlong && y >= 0 && y < this.nlarg) {
            this.grille[x][y].contenu = contenu;
        } else {
            throw new Error("Invalid coordinates");
        }
    }

    verifPortee(pointA, pointB, portee){
        if(! (pointA instanceof Case))
            throw TypeError("Wrong argument type pointA in Plateau: verifPortee")

        if(! (pointB instanceof Case))
            throw TypeError("Wrong argument type pointB in Plateau: verifPortee")

        if(pointA.diffCoord(pointB) <= portee)
            return true
        else return false
    }

    /*
    setCaseContentPlacerNavire(x, y, contenu) {
        if (x >= 0 && x < this.nlong && y >= 0 && y < this.nlarg) {
            this.grille[x][y].placerNavire(contenu);
        } else {
            throw new Error("Invalid coordinates");
        }
    }
    */
}