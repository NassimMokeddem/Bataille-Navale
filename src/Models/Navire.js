/*
* La classe Navire permet de décrire un navire pour le jeu.
* sante : points de vie
* relation degat et armure -> degat / armure ???
* pm : capacité point de mouvements
* pa : capacité points d'action
*/

export class Navire {
    constructor(type, sante, degat, armure, pm, pa){
        this.type = type;
        this.sante = sante;
        this.degat = degat;
        this.armure = armure;
        this.pm = pm;
        this.pa = pa;
    }

    isEqual(obj){
        if (! obj instanceof Navire) return false;
        if (obj.type != this.type || 
            obj.sante != this.sante || 
            obj.degat != this.degat || 
            obj.armure != this.armure || 
            obj.pm != this.pm || 
            obj.pa != this.pa) return false;

        return true;
    }

    estDetruit(){
        return this.sante <= 0;
    }
}

export class Destroyer extends Navire{
    constructor(){
        super('Destroyer', 15, 2, 5, 5, 2);
    }
}

export class SousMarin extends Navire{
    constructor(){
        super('SousMarin', 14, 12, 3, 4, 4);
    }
}

export class Fregate extends Navire{
    constructor(){
        super('Fregate', 20, 4, 8, 3, 6);
    }
}
