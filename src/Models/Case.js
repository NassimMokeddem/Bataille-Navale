export default class Case{
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.contenu = null
    }

    getX(){ return this.x }

    getY(){ return this.y }

    getContenu(){ return this.contenu }

    estVide(){
        return this.contenu === null;
    }

    placerNavire(navire){
        this.contenu = navire;
    }

    vider(){
        this.contenu = null;
    }

    diffCoord( point ){
        if(! (point instanceof Case) )
            throw TypeError("Wrong argument type Case: diffCoord")

        return Math.abs( this.getX() - point.getX() ) + Math.abs( this.getY() - point.getY() )
    }
}