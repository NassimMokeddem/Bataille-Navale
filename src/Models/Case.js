export class Case{
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.contenu = null
    }

    estVide(){
        return this.contenu === null;
    }

    placerNavire(navire){
        this.contenu = navire;
    }

    vider(){
        this.contenu = null;
    }
}