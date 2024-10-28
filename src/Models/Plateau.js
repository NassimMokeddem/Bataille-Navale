import Case from "./Case.js";
import { Navire } from "./Navire.js";

/**
 * @module Plateau
 */

/**
 * @property {Int} nlong - Number of rows
 * @property {Int} nlarg - Number of columns
 * @property {Array<Case>} grille - The board of the game in 2 dimensions
 * 
 * 
 * @description Represent a board
 */

export default class Plateau {
    /**
     * @constructs 
     */
    constructor(nlong, nlarg) {
        this.nlong = nlong;
        this.nlarg = nlarg;
        this.grille = this.initialiserGrille(nlong, nlarg);
    }

    /**
     * @private
     */
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

    /**
     * @private
     */
    getCase(x, y) {
        if (x >= 0 && x < this.nlarg && y >= 0 && y < this.nlong) {
            return this.grille[y][x];
        } else {
            throw new Error("Invalid coordinates");
        }
    }

    /**
     * @public
     * @param {Int} x - The x coordinate
     * @param {Int} y - The y coordinate
     * @param {obj} contenu - The object to place in the board
     */
    setCaseContent(x, y, contenu) {
        if (x >= 0 && x < this.nlarg && y >= 0 && y < this.nlong) {
            this.grille[y][x].contenu = contenu;
        } else {
            throw new Error("Invalid coordinates");
        }
    }

    enoughSpace(x, y, dimension){
        if(! Array.isArray(dimension)){
            throw new TypeError("Bad type of dimension in Plateau: enoughSpace")
        }

        // Vérification des coordonnées
        if(x+dimension.at(0) > this.nlarg || 
           y+dimension.at(1) > this.nlong ||
           x < 0 ||
           y < 0
        ){
            throw new Error("Invalid coordinates for this object in Plateau: enoughSpace")
        }

        for(let i=0; i<dimension.at(0); i++){
            for(let j=0; j<dimension.at(1); j++){

                // Si une seule case est déjà rempli alors pas assez d'espace
                if(! (this.getCase(x+i, y+j).estVide())){
                    return false
                }
            }
        }

        // Si toute les cases sont libres alors on peut insérez l'objet
        return true
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