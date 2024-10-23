export default class Case{
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.contenu = null
    }

    getX(){ return this.x }

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