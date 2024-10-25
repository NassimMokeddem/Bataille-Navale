import { Navire, Transporteur } from "./Navire.js"

export default class BaseNavale{
    constructor(){
        this.dimension = [2,2]
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