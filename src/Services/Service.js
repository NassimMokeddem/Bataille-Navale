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

    applyShot(x1, y1, x2, y2, res, plateau){ // x1 et y1 bateau source du tir
        if(x1 === x2 && y1 === y2){ // ajouter case ou il y'avait un bateau mais détruit
            res.json({ message: `On ne peux pas se tirer dessus !!! x:${x2} y:${y2}`, plateau});
        }
        else if(plateau.grille[x2][y2].contenu === null){
            res.json({ message: `Aucun bateau sur la case x:${x2} y:${y2}`, plateau});
        }
        else if(plateau.grille[x2][y2].contenu.sante < plateau.grille[x1][y1].contenu.degat){
            plateau.grille[x2][y2].vider();
            res.json({ message: `Bateau detruit sur la case x:${x2} y:${y2}`, plateau});
        }
        else{
            plateau.grille[x2][y2].contenu.sante = plateau.grille[x2][y2].contenu.sante - plateau.grille[x1][y1].contenu.degat;
            res.json({ message: `x:${x1} y:${y1} tire sur la case x:${x2} y:${y2}`, plateau });
        }
    }
}
