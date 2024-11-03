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
        this.argent = 1000000;
        this.naviresJ = new Array();
    }

    getArgent(){ return this.argent }

    getNaviresJ(){ return this.naviresJ }

    getIdJoueur(){ return this.idJoueur }

    getDimension(){ return this.dimension }

    setArgent(argent){ this.argent = argent }

    findNavire(navireSearch){
        if(! (navireSearch instanceof Navire)){
            throw new TypeError("Bad argument type navireSearch in BaseNavale: findNavire")
        }

        const index = this.getNaviresJ().findIndex((navire) => navire.isEqual(navireSearch))

        if(index == -1){
            return null
        }

        return this.getNaviresJ().at(index)
    }


    resupplyNavire(navire){
        /**
         * TO DO
         * Reste à vérifier si le bateau appartient au bon joueur
         */
        if(!this.naviresJ.includes(navire)){
            throw new TypeError("resupplyNavire -> Le navire ne vous appartient pas")
        }
        
        if(! (navire instanceof Navire)){
            throw new TypeError("resupplyNavire -> n'est pas un navire")
        }

        navire.setProvision(navire.getProvisionMax())

        navire.setEquipage(navire.getEquipageMax())
    }

    repareNavire(navire){
        /**
         * TO DO
         * Reste à vérifier si le bateau appartient au bon joueur
         */
        if(!this.naviresJ.includes(navire)){
            throw new TypeError("repareNavire -> Le navire vous appartient pas")
        }
        if(! (navire instanceof Navire)){
            throw new TypeError("repareNavire -> n'est pas un navire")
        }

        navire.setSante(navire.getSanteMax())
    }
}