/*
* La classe Navire permet de décrire un navire pour le jeu.
* sante : points de vie
* relation degat et armure -> degat / armure ???
* pm : capacité point de mouvements
* pa : capacité points d'action
*/

export default class Navire {
    constructor(type) {
        this.type = type;
        this.sante = this.definirSanteNavire(type);
        this.degat = this.definirDegatNavire(type);
        this.armure = this.definirArmureNavire(type);
        this.pm = this.definirPMNavire(type);
        this.pa = this.definirPANavire(type);
    }   


/*
*   Les méthodes qui vont suivre permettent de définir des
*   stats pour les types de bateau
*/
    definirSanteNavire(type){
        switch(type){
            case 'Destroyer':
                return 15;
            case 'Sous-marin':
                return 10;
            case 'Frégate':
                return 20;
            default:
                return 5; 
        }
    }

    definirDegatNavire(type){
        switch(type){
            case 'Destroyer':
                return 2;
            case 'Sous-marin':
                return 6;
            case 'Frégate':
                return 4;
            default:
                return 1; 
        }
    }


    definirArmureNavire(type){
        switch(type){
            case 'Destroyer':
                return 5;
            case 'Sous-marin':
                return 3;
            case 'Frégate':
                return 8;
            default:
                return 1; 
        }
    }

    definirPMNavire(type){
        switch(type){
            case 'Destroyer':
                return 5;
            case 'Sous-marin':
                return 2;
            case 'Frégate':
                return 3;
            default:
                return 1; 
        }
    }

    definirPANavire(type){
        switch(type){
            case 'Destroyer':
                return 2;
            case 'Sous-marin':
                return 4;
            case 'Frégate':
                return 6;
            default:
                return 1; 
        }
    }

    estDetruit(){
        return this.sante <= 0;
    }
}