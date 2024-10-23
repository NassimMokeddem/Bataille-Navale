import Case from "./Case.js";
import { Navire } from "./Navire.js";

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

    tirerNavire(attaquant, defenseur, cAttaquant, cDefenseur){
        if(! (attaquant instanceof Navire))
            throw TypeError("Wrong argument type attaquant in Plateau: tirerNavire")

        /*
        *  TO DO
        *  Reste à ajouter si c'est une base
        */
        if(! (defenseur instanceof Navire))
            throw TypeError("Wrong argument type defenseur in Plateau: tirerNavire")

        if(! (cAttaquant instanceof Case) )
            throw TypeError("Wrong argument type cAttaquant in Plateau: tirerNavire")

        if(! (cDefenseur instanceof Case) )
            throw TypeError("Wrong argument type cDefenseur in Plateau: tirerNavire")

        if(! this.verifPortee(cAttaquant, cDefenseur, attaquant.getPortee()))
            throw Error("The attacker doesn\'t have enough range")

        try{
            attaquant.tirer(defenseur);
        }
        catch(err ){
            if(err instanceof TypeError)
                throw TypeError("Wrong argument type defenseur in Plateau: tirerNavire\nWent through the first control of Plateau: tirerNavire")
        }

        if(defenseur.estDetruit())
            cDefenseur.vider();

        return defenseur
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