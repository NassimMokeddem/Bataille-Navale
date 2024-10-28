import { Navire, Transporteur } from "./Navire.js"

/**
 * @module BaseNavale
 */

/**
 * @property {Array<Int>} dimension - Dimension of a navy base
 * @property {Int} idJoueur - Identifier for player
 * @property {Int} argent - Money in the game of the player
 * @property {Array<Navire>} naviresJ - Boats the player got
 * 
 * @description Represent a navy base, it is the headquarters for the player's fleet
 */

export default class BaseNavale{
    /**
     * @constructs
     * 
     * @method resupplyNavire
     * @method repareNavire
     */
    constructor(idJoueur){
        if( idJoueur != 1 && idJoueur != 2){
            throw new Error("Wrong argument idJoueur in BaseNavale: constructor ")
        } 
        this.dimension = [2,2];
        this.idJoueur = idJoueur;
        this.argent = 100;
        this.naviresJ = new Array();
    }

    resupplyNavire(navire){
        /**
         * TO DO
         * Reste à vérifier si le bateau appartient au bon joueur
         */
        if(! (navire instanceof Navire)){
            throw new TypeError("Bad argument navire in BaseNavale: resupplyNavire")
        }

        navire.setProvision(navire.getProvisionMax())

        navire.setEquipage(navire.getEquipageMax())
    }

    repareNavire(navire){
        /**
         * TO DO
         * Reste à vérifier si le bateau appartient au bon joueur
         */
        if(! (navire instanceof Navire)){
            throw new TypeError("Bad argument navire in BaseNavale: repareNavire")
        }

        navire.setSante(navire.getSanteMax())
    }
}