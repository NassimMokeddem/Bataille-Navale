import Case from "./Case.js";

export default class Plateau {
    constructor(nlong, nlarg){
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

    getCase(x, y){
        return this.grille[x][y];
    }
}