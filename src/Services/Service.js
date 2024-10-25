import { Navire, Destroyer, SousMarin, Fregate} from "../Models/Navire.js"
import Plateau from "../Models/Plateau.js";
import Case from "../Models/Case.js";
import BaseNavale from "../Models/BaseNavale.js";

export default class Service{
    createNavire(type){
        switch(type){
            case 'Destroyer':
                return new Destroyer();
            case 'SousMarin':
                return new SousMarin();
            case 'Fregate':
                return new Fregate();
            default:
                return null;
        }
    }

    createPlateau(nlong, nlarg) {
        this.plateau = new Plateau(nlong, nlarg); 
        return this.plateau;
    }


    /**
     * 
     * @param {Int} nbJoueur 
     */
    /**
     * TO DO
     * if on nbJoueur = 1 doesn't work
     */
    createBaseNavale(nbJoueur) {
        if(!this.plateau){
            throw new Error("No plateau found. Create a plateau first in Service: createBaseNavale.");
        }

        if(nbJoueur == 1){
            this.getPlateau().
                setCaseContent(0, 0, new BaseNavale());
        }
        if(nbJoueur == 2){
            this.getPlateau().
                setCaseContent(this.getPlateau().nlong-1, this.getPlateau().nlarg-1, new BaseNavale());
        }
        else{
            console.log(nbJoueur);
            throw new Error("Bad argument nbJoueur in Service: createBaseNavale");
        }
    }

    getPlateau() {
        if (!this.plateau) {
            throw new Error("No plateau found. Create a plateau first.");
        }
        return this.plateau;
    }

    getBaseNavale(nbJoueur){
        if(nbJoueur == 1){
            return this.getPlateau().getCase(0,0).getContenu()
        }
        if(nbJoueur == 2){
            return this.getPlateau().getCase(this.getPlateau().nlong-1,this.getPlateau().nlarg-1).getContenu()
        }
        else{
            throw new Error("Bad argument nbJoueur in Service: getBaseNavale");
        }
    }

    updatePlateau(x, y, contenu) {
        if (!this.plateau) {
        throw new Error("No plateau found. Create a plateau first.");
        }
        if (! (contenu instanceof Navire)){
        throw new TypeError("Bad type of contenu in Service: updatePlate    au") 
        }

        for(let i=0; i<contenu.getDimension()[0]; i++){
            for(let j=0; j<contenu.getDimension()[1]; j++){
                this.getPlateau().setCaseContent(x+i, y+j, contenu)
            }
        }
    }

    calculDegat(attaquant, defenseur){
        /*
        *  TO DO
        *  Reste à ajouter si c'est une base
        */
        if(! (attaquant instanceof Navire))
            throw TypeError("Wrong argument type attaquant in Navire: calculDegat")

        if(! (defenseur instanceof Navire))
            throw TypeError("Wrong argument type defenseur in Navire: calculDegat")

        const degatAppliquee = attaquant.getDegat() - defenseur.getArmure();
        if(degatAppliquee <= 0)
            return 0
        return degatAppliquee
    }

    diffCoord( pointA, pointB ){
        if(! (pointA instanceof Case) )
            throw TypeError("Wrong argument type pointA Service: diffCoord")

        if(! (pointB instanceof Case) )
            throw TypeError("Wrong argument type pointB Service: diffCoord")

        return Math.abs( pointA.getX() - pointB.getX() ) + Math.abs( pointA.getY() - pointB.getY() )
    }

    verifPortee(pointA, pointB, portee){
        if(! (pointA instanceof Case))
            throw TypeError("Wrong argument type pointA in Service: verifPortee")

        if(! (pointB instanceof Case))
            throw TypeError("Wrong argument type pointB in Service: verifPortee")

        if(this.diffCoord(pointA, pointB) <= portee)
            return true
        else return false
    }

    appliqueDegat(attaquant, defenseur){
        /*
        *  TO DO
        *  Reste à ajouter si c'est une base
        */
        if(! (attaquant instanceof Navire)){
            throw TypeError("Wrong argument type attaquant in Service: tirer")
        }

        if(! (defenseur instanceof Navire)){
            throw TypeError("Wrong argument type defenseur in Service: tirer")
        }

        var degatAppliquee = 0;

        try{
            degatAppliquee = this.calculDegat(attaquant, defenseur);
        }
        catch(err ){
            if(err instanceof TypeError)
                throw TypeError("Wrong argument type in Service: tirer\nWent through the first control of Service: tirer")
        }

        if(defenseur.getSante() > degatAppliquee)
            defenseur.setSante(defenseur.getSante() - degatAppliquee)
        else defenseur.setSante(0)
    }

    tirer(attaquant, defenseur, cAttaquant, cDefenseur){
        /*
        *  TO DO
        *  Reste à ajouter si c'est une base
        */
        if(! (attaquant instanceof Navire))
            throw TypeError("Wrong argument type attaquant in Plateau: tirerNavire")

        if(! (defenseur instanceof Navire))
            throw TypeError("Wrong argument type defenseur in Plateau: tirerNavire")

        if(! (cAttaquant instanceof Case) )
            throw TypeError("Wrong argument type cAttaquant in Plateau: tirerNavire")

        if(! (cDefenseur instanceof Case) )
            throw TypeError("Wrong argument type cDefenseur in Plateau: tirerNavire")

        if(! this.verifPortee(cAttaquant, cDefenseur, attaquant.getPortee()))
            throw Error("The attacker doesn\'t have enough range")

        try{
            this.appliqueDegat(attaquant, defenseur);
        }
        catch(err ){
            if(err instanceof TypeError)
                throw TypeError("Wrong argument type in Service: tirerNavire\nWent through the first control of Service: tirerNavire")
        }

        if(defenseur.estDetruit())
            cDefenseur.vider();

        return defenseur
    }


    /*
    * Deprecated
    */
    applyShot(x1, y1, x2, y2, res, plateau){ // x1 et y1 bateau source du tir
        if(x1 === x2 && y1 === y2){ // ajouter case ou il y'avait un bateau mais détruit
            res.json({ message: `On ne peux pas se tirer dessus !!! x:${x2} y:${y2}`, plateau});
        }
        else if(plateau.grille[x2][y2].contenu === null){
            res.json({ message: `Aucun bateau sur la case x:${x2} y:${y2}`, plateau});
        }
        else if(plateau.grille[x2][y2].contenu.sante < plateau.grille[x1][y1].contenu.degat){
            plateau.grille[x2][y2].vider();
            res.json({ message: `Bateau detruit sur la case x:${x2} y:${y2}`, plateau});
        }
        else{
            plateau.grille[x2][y2].contenu.sante = plateau.grille[x2][y2].contenu.sante - plateau.grille[x1][y1].contenu.degat;
            res.json({ message: `x:${x1} y:${y1} tire sur la case x:${x2} y:${y2}`, plateau });
        }
    }

    repare(navire, nbJoueur){
        /**
         * TO DO
         * Reste à vérifier si le bateau appartient au bon joueur
         */
        if(! (navire instanceof Navire)){
            throw new TypeError("Bad argument navire in BaseNavale: resupplyNavire")
        }

        try{
            this.getBaseNavale(nbJoueur).repareNavire(navire);
        }
        catch(err ){
            console.log(err.stack)
            throw new Error("Error on Service: resupply");
        }
        
    }
}
