import { Destroyer, SousMarin, Fregate} from "../Models/Navire.js"
import Plateau from "../Models/Plateau.js";

export default class Service{
    createNavire(type){
        switch(type){
            case 'Destroyer':
                return new Destroyer();
            case 'SousMarin':
                return new SousMarin();
            case 'Fregate':
                return new Fregate();
            default:
                return null;
        }
    }

    createPlateau(nlong, nlarg){
        return new Plateau(nlong, nlarg);
    }
}