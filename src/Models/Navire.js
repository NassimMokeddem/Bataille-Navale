/*
* La classe Navire permet de décrire un navire pour le jeu.
* sante : points de vie
* relation degat et armure -> degat / armure ???
* pm : capacité point de mouvements
* pa : capacité points d'action
*/

export class Navire {
    constructor(type, sante, degat, armure, pm, pa, portee){
        this.type = type;
        this.sante = sante;
        this.degat = degat;
        this.armure = armure;
        this.pm = pm;
        this.pa = pa;
        this.portee = portee;
    }

    isEqual(obj){
        if (! obj instanceof Navire) return false;
        if (obj.type != this.type || 
            obj.sante != this.sante || 
            obj.degat != this.degat || 
            obj.armure != this.armure || 
            obj.pm != this.pm || 
            obj.pa != this.pa ||
            obj.portee != this.portee ) return false;
            
            return true;
        }

    getPortee(){ return this.portee }
    
    getDegat(){ return this.degat }
    
    getArmure(){ return this.armure }
    
    getSante(){ return this.sante }

    setSante(sante){ this.sante = sante }
    
    estDetruit(){
        return this.sante <= 0;
    }

    static calculDegat(attaquant, defenseur){
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

    tirer(cible){
        /*
        *  TO DO
        *  Reste à ajouter si c'est une base
        */
        if(! (cible instanceof Navire)){
            throw TypeError("Wrong argument type in Navire: tirer")
        }

        var degatAppliquee = 0;

        try{
            degatAppliquee = Navire.calculDegat(this, cible);
        }
        catch(err ){
            if(err instanceof TypeError)
                throw TypeError("Wrong argument type in Navire: tirer\nWent through the first control of Navire: tirer")
        }

        if(cible.getSante() > degatAppliquee)
            cible.setSante(cible.getSante() - degatAppliquee)
        else cible.setSante(0)
    }
}

export class Destroyer extends Navire{
    constructor(){
        super('Destroyer', 15, 2, 5, 5, 2, 2);
    }
}

export class SousMarin extends Navire{
    constructor(){
        super('SousMarin', 14, 12, 3, 4, 4, 1);
    }
}

export class Fregate extends Navire{
    constructor(){
        super('Fregate', 20, 4, 8, 3, 6, 3);
    }
}
