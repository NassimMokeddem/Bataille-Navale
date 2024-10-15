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

    createPlateau(nlong, nlarg) {
        this.plateau = new Plateau(nlong, nlarg); 
        return this.plateau;
    }

    getPlateau() {
        if (!this.plateau) {
            throw new Error("No plateau found. Create a plateau first.");
        }
        return this.plateau;
    }

    updatePlateau(x, y, contenu) {
        if (!this.plateau) {
            throw new Error("No plateau found. Create a plateau first.");
        }
        this.plateau.setCaseContent(x, y, contenu);
    }
}
