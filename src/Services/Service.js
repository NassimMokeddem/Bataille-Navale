import Navire from "../Models/Navire.js"
import Plateau from "../Models/Plateau.js";

export default class Service{
    createNavire(type){
        return new Navire(type);
    }

    createPlateau(nlong, nlarg){
        return new Plateau(nlong, nlarg);
    }
}