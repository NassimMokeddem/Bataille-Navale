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
    
    estDetruit(){
        return this.sante <= 0;
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
