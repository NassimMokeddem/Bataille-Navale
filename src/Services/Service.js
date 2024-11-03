import { Navire, Destroyer, SousMarin, Fregate} from "../Models/Navire.js"
import Plateau from "../Models/Plateau.js";
import Case from "../Models/Case.js";
import BaseNavale from "../Models/BaseNavale.js";

export default class Service{
    /**
     * 
     * passé en méthode privé comme ça on aura pas
     * de problème pour relier un bateau à un joueur
     * 
     * Il faut garder la relation BaseNavale contient
     * liste bateau détenu par le joueur
     * 
     * et de placer ces objets sur le Plateau
     * 
     * Sinon les modifications des objets que vous
     * apporterez sur le Plateau ne sera pas vu dans
     * la liste de BaseNavale du joueur
     */
    #createNavire(type){
        switch(type){
            case 'Destroyer':
                return new Destroyer();
            case 'SousMarin':
                return new SousMarin();
            case 'Fregate':
                return new Fregate();
            case 'Transporteur':
                return new Transporteur();
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
    createBaseNavale(idJoueur) {
        if(!this.plateau){
            throw new Error("No plateau found. Create a plateau first in Service: createBaseNavale.");
        }

        if(idJoueur == 1){
            this.updatePlateau(0, 0, new BaseNavale(idJoueur));
            return
        }
        if(idJoueur == 2){
            this.updatePlateau(this.getPlateau().nlarg-2, this.getPlateau().nlong-2, new BaseNavale(idJoueur));
            return
        }
        else{
            throw new Error("Bad argument idJoueur in Service: createBaseNavale");
        }
    }

    getPlateau() {
        if (!this.plateau) {
            throw new Error("No plateau found. Create a plateau first.");
        }
        return this.plateau;
    }

    getBaseNavale(idJoueur){
        if(idJoueur == 1){
            return this.getPlateau().getCase(0,0).getContenu()
        }
        if(idJoueur == 2){
            return this.getPlateau().getCase(this.getPlateau().nlarg-2,this.getPlateau().nlong-2).getContenu()
        }
        else{
            throw new Error("Bad argument nbJoueur in Service: getBaseNavale");
        }
    }

    inTerritory(idJoueur, x, y){

        if(idJoueur == 1){
            return (x >= 0 && x < this.getPlateau().nlarg && y >= 0 && y < this.getPlateau().nlong - x)
        }

        if(idJoueur == 2){
            return (x >= 0 && x < this.getPlateau().nlarg && y >= this.getPlateau().nlong - x && y < this.getPlateau().nlong)
        }
    }

    /**
     * Fait à l'arrache pas utilisable dans des cas plus généraux
     * 
     * Je pars du principe que dans les tableaux
     * indice 0 = abscisses / coord x
     * indice 1 = ordonnees / coord y
     */
    spaceBaseAvailable(idJoueur, dimension){
        if(idJoueur != 1 && idJoueur != 2){
            throw new Error("Bad argument nbJoueur in Service: spaceBaseAvailable")
        }

        if(! (dimension instanceof Array)){
            throw new TypeError("Bad argument type dimension in Service: spaceBaseAvailable")
        }


        /**
         * Initialisation des variables et constantes
         */
        var coordAvailable = false;

        var base = null
        try{
            base = this.getBaseNavale(idJoueur);
        }
        catch(err ){
            throw err
        }

        /**
         * On va séparer la vérif en 2 cas car 2 joueurs
         * et seulement 2 coord de base
         */
        if(idJoueur == 1){
            //coordonée de la base du joueur 1 voir createBaseNavale
            const coordBase = Array.of(0, 0);

            // longueur
            for(let yAxis=0; yAxis <= coordBase.at(1) + base.getDimension().at(1); yAxis++){
                try{
                    coordAvailable = this.getPlateau().enoughSpace(
                                                        coordBase.at(0) + base.getDimension().at(0),
                                                        yAxis,
                                                        dimension
                    )
                }
                catch(err ){
                    throw err
                }

                if(coordAvailable == true){
                    return Array.of(coordBase.at(0) + base.getDimension().at(0), yAxis)
                }
            }

            //largeur
            for(let xAxis=0; xAxis < coordBase.at(0) + base.getDimension().at(0); xAxis++){
                try{
                    coordAvailable = this.getPlateau().enoughSpace(
                                                        xAxis,
                                                        coordBase.at(1) + base.getDimension().at(1),
                                                        dimension
                    )
                }
                catch(err ){
                    throw err
                }

                if(coordAvailable == true){
                    return Array.of(xAxis, coordBase.at(1) + base.getDimension().at(1))
                }
            }
        }

        if(idJoueur == 2){
            const coordBase = Array.of(this.getPlateau().nlarg-2, this.getPlateau().nlong-2);

            //longueur
            /**
             * Ici je vais vérifier en fonction de la dimension
             * de l'objet par rapport aux dimensions de la base
             */
            var yAxisGap = 0;
            if(base.getDimension().at(1) < dimension.at(1)){
                yAxisGap = dimension.at(1) - base.getDimension().at(1);
            }
            else { 
                yAxisGap = 1; 
            }

            for(let yAxis = -yAxisGap; yAxis < base.getDimension().at(1); yAxis++){
                try{
                    coordAvailable = this.getPlateau().enoughSpace(
                                                            coordBase.at(0) - dimension.at(0),
                                                            coordBase.at(1) + yAxis,
                                                            dimension
                    )
                }
                catch(err ){
                    if(err.message != "Invalid coordinates for this object in Plateau: enoughSpace"){
                        throw err
                    }
                }

                if(coordAvailable == true){
                    return Array.of(coordBase.at(0) - dimension.at(0), coordBase.at(1) + yAxis)
                }
            }

            //largeur
            for(let xAxis=0; xAxis < base.getDimension().at(0); xAxis++){
                for(let yAxis=1; yAxis <= dimension.at(1); yAxis++){
                    try{
                        coordAvailable = this.getPlateau().enoughSpace(
                                                                coordBase.at(0) + xAxis,
                                                                coordBase.at(1) - yAxis,
                                                                dimension
                        )
                    }
                    catch(err ){
                        if(err.message != "Invalid coordinates for this object in Plateau: enoughSpace"){
                            throw err
                        }
                    }

                    if(coordAvailable == true){
                        return Array.of(coordBase.at(0) + xAxis, coordBase.at(1) - yAxis)
                    }
                }

            }
        }

        // Si on arrive là ça veut dire qu'il n'y a pas de place autour de la base
        throw new Error("No space around BaseNavale in Service: spaceBaseAvailable");
    }

    buyNavire(idJoueur, type, x, y){
        var prix;

        // Evaluation du prix
        switch(type) {
            case 'Destroyer':
                prix = 20;
                break;
            case 'SousMarin':
                prix = 100;
                break;
            case 'Fregate':
                prix = 35;
                break;
            case 'Trasporteur':
                prix = 300;
            default:
                throw new Error("Bas argument type in Service: buyNavire");
        }

        const argent = this.getBaseNavale(idJoueur).getArgent();

        if(argent < prix){
            return "Pas assez d'argent"
        }

        //Modification ressource
        this.getBaseNavale(idJoueur).setArgent(argent - prix);
        
        const navire = this.#createNavire(type);

        this.getBaseNavale(idJoueur).getNaviresJ().push(navire);

        try{
            if (!this.inTerritory(idJoueur, x ,y))
                throw new Error("You can't place a boat that you bought outside of your territory")
            if(!this.getPlateau().enoughSpace(x, y, navire.getDimension()))
                throw new Error("You can't place a boat here. Not enough space")

            this.updatePlateau(x, y, navire)
        }
        catch(err ){
            throw err
        }
    }

    updatePlateau(x, y, contenu) {
        if (!this.plateau) {
        throw new Error("No plateau found. Create a plateau first.");
        }
        if ((! (contenu instanceof Navire)) && (! (contenu instanceof BaseNavale))){
        throw new TypeError("Bad type of contenu in Service: updatePlateau") 
        }

        const dimension = contenu.getDimension();

        if(! (this.getPlateau().enoughSpace(x, y, dimension))){
            throw new Error("Not enough space to put the object in Service: updatePlateau")
        }

        for(let i=0; i<dimension.at(0); i++){
            for(let j=0; j<dimension.at(1); j++){
                this.getPlateau().setCaseContent(x+i, y+j, contenu)
            }
        }
    }

    calculDegat(attaquant, defenseur){

        if((attaquant instanceof BaseNavale) || (defenseur instanceof BaseNavale) ){
            throw new Error("calculDegat (Service.js) -> attaquant est une base Navale ou defenseur est une base Navale")
           }

        if(! (attaquant instanceof Navire))
            throw TypeError("Wrong argument type attaquant in Navire: calculDegat")

        if(! (defenseur instanceof Navire))
            throw TypeError("Wrong argument type defenseur in Navire: calculDegat")
        
        const degatAppliquee = attaquant.getDegat() - defenseur.getArmure();
        if(degatAppliquee <= 0)
            return 1
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
       
        if((attaquant instanceof BaseNavale) || (defenseur instanceof BaseNavale) ){
            throw new Error("calculDegat (Service.js) -> attaquant est une base Navale ou defenseur est une base Navale")
        }

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
/*
    tirer(cAttaquant, cDefenseur){

        if(attaquant instanceof BaseNavale)
            throw TypeError("Wrong argument type attaquant (Base) in Plateau: tirerNavire")

        if(defenseur instanceof BaseNavale)
            throw TypeError("Wrong argument type defenseur (Base) in Plateau: tirerNavire")

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

  */
    tirer(xAttaquant, yAttaquant, xDefenseur, yDefenseur){
        let attaquant = this.getPlateau().getCase(xAttaquant, yAttaquant).getContenu()
        let defenseur = this.getPlateau().getCase(xDefenseur, yDefenseur).getContenu()

        if(attaquant instanceof BaseNavale)
            throw TypeError("Wrong argument type attaquant (Base) in Plateau: tirerNavire")

        if(defenseur instanceof BaseNavale)
            throw TypeError("Wrong argument type defenseur (Base) in Plateau: tirerNavire")

        if(! (attaquant instanceof Navire))
            throw TypeError("Wrong argument type attaquant in Plateau: tirerNavire")

        if(! (defenseur instanceof Navire))
            throw TypeError("Wrong argument type defenseur in Plateau: tirerNavire")

        if(! this.verifPortee(this.getPlateau().getCase(xAttaquant, yAttaquant), this.getPlateau().getCase(xDefenseur, yDefenseur), attaquant.getPortee()))
            throw Error("The attacker doesn\'t have enough range")

        try{
            this.appliqueDegat(attaquant, defenseur);
        }
        catch(err ){
            if(err instanceof TypeError)
                throw TypeError("Wrong argument type in Service: tirerNavire\nWent through the first control of Service: tirerNavire")
        }

        if(defenseur.estDetruit())
            this.getPlateau().getCase(xDefenseur, yDefenseur).vider();

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

    repare(xRepare, yRepare, idJoueur){
        let navire = this.getPlateau().getCase(xRepare, yRepare).getContenu()
        
        if(! (this.getBaseNavale(idJoueur).naviresJ.includes(navire))){
            throw new TypeError("resupplyNavire (Service.js) -> Le navire ne vous appartient pas")
        }
        if(! (navire instanceof Navire)){
            throw new TypeError("Bad argument navire in BaseNavale: resupplyNavire (Service.js)")
        }

        try{
            this.getBaseNavale(idJoueur).repareNavire(navire);
        }
        catch(err ){
            console.log(err.stack)
            throw new Error("Error on Service: resupply");
        }
        
    }


    updateFood(idJoueur){
        this.getBaseNavale(idJoueur).naviresJ.forEach(element => {
            element.nourriture -= 5;
        });
        
    }

    moveNavire(xNavire, yNavire, xDeplacement, yDeplacement, idJoueur){
        let navire = this.getPlateau().getCase(xNavire, yNavire).getContenu()

        if(navire instanceof BaseNavale)
            throw TypeError("Wrong argument type navire (Base) in Plateau: moveNavire")

        if(! (navire instanceof Navire)){
            throw new TypeError("Bad argument navire in BaseNavale: moveNavire")
        }
        
        if(! (this.getBaseNavale(idJoueur).naviresJ.includes(navire))){
            throw new TypeError("resupplyNavire -> Le navire ne vous appartient pas")
        }
        

        for(let i = 0; i < navire.getDimension()[1] - 1; i++){
            if((yNavire - 1) < 0 ||
               this.getPlateau().getCase(xNavire, yNavire - 1).getContenu() === null ||
               this.getPlateau().getCase(xNavire, yNavire - 1).getContenu() !== navire){
               break;
            }
            else{
                yNavire -= 1
            }
        }

        if(Math.abs(xNavire - xDeplacement) + Math.abs(yNavire - yDeplacement) <= navire.pm){
            if(this.getPlateau().enoughSpaceMove(xDeplacement, yDeplacement, navire.getDimension(), navire)){
                for(let i = 0; i < navire.getDimension()[1]; i++){
                    this.getPlateau().getCase(xNavire, yNavire + i).vider()
                }
                this.updatePlateau(xDeplacement, yDeplacement, navire)
                navire.pm -= Math.abs(xNavire - xDeplacement) + Math.abs(yNavire - yDeplacement)
            }
            else{
                throw Error("Déplacement impossible")
            }
        }
        else{
            throw Error("Pas assez de point de déplacement")
        }
    }

    startGame(){
        this.createPlateau(15, 15);
        this.createBaseNavale(1);
        this.createBaseNavale(2);
    }
}
