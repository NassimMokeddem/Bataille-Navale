/**
 * @class
 * @property {String} type - Type of boat
 * @property {Int} sante - Lifepoint of a boat
 * @property {Int} degat - Damage of the boat
 * @property {Int} armure - Armor of the boat
 * @property {Int} pm - Move points of the boat
 * @property {Int} pa - Action points of the boat
 * @property {Int} portee - Range of the boat
 * @property {Array<Int>} dimension - Specify the dimensions of the boat
 * 
*
* @description Represent a boat
*/
export class Navire {
    /**
     * @constructs
     * 
     * @method estDetruit
     * 
     */
    constructor(type, sante, degat, armure, pm, pa, portee, dimension){
        this.type = type;
        this.sante = sante;
        this.santeMax = sante
        this.degat = degat;
        this.armure = armure;
        this.pm = pm;
        this.pa = pa;
        this.portee = portee;
        this.dimension = [dimension[0], dimension[1]]
    }

    /**
     * @private
     */
    isEqual(obj){
        if (! obj instanceof Navire) return false;
        if (obj.type != this.type || 
            obj.sante != this.sante || 
            obj.degat != this.degat || 
            obj.armure != this.armure || 
            obj.pm != this.pm || 
            obj.pa != this.pa ||
            obj.portee != this.portee ||
            obj.dimension[0] != this.dimension[0] ||
            obj.dimension[1] != this.dimension[1]
        ) return false;
            
            return true;
        }

    /**
     * @private
     */
    getPortee(){ return this.portee }
    
    /**
     * @private
     */
    getDegat(){ return this.degat }
    
    /**
     * @private
     */
    getArmure(){ return this.armure }
    
    /**
     * @private
     */
    getSante(){ return this.sante }
    
    /**
     * @private
     */
    getSanteMax(){ return this.santeMax }

    /**
     * @private
     */
    getDimension(){ return this.dimension }

    /**
     * @private
     */
    setSante(sante){ this.sante = sante }
    
    /**
     * @returns {boolean} Returns if the boat is destroyed or not by his lifepoints remaining
     */
    estDetruit(){
        return this.sante <= 0;
    }

    
}

/**
 * @augments Navire
 * @description Represent a Destroyer a pretty standard boat
 * <br>Here are the stats : 
 * <ul>
 *  <li>type -> Destroyer</li>
 *  <li>sante -> 15</li> 
 *  <li>degat -> 2</li>
 *  <li>armure -> 5</li>
 *  <li>pm -> 5</li>
 *  <li>pa -> 2</li>
 *  <li>portee -> 2</li>
 *  <li>dimension -> [1, 2]</li>
 * </ul>
 */
export class Destroyer extends Navire{
    /**
     * @constructs
    */
    constructor(){
        super('Destroyer', 15, 2, 5, 5, 2, 2, [1, 2]);
    }
}

/**
 * @augments Navire
 * @description Represent a Submarine a very strong boat and silent
 * <br>Here are the stats : 
 * <ul>
 *  <li>type -> SousMarin</li>
 *  <li>sante -> 14</li> 
 *  <li>degat -> 12</li>
 *  <li>armure -> 3</li>
 *  <li>pm -> 4</li>
 *  <li>pa -> 4</li>
 *  <li>portee -> 1</li>
 *  <li>dimension -> [1, 1]</li>
 * </ul>
 */
export class SousMarin extends Navire{
    /**
     * @constructs
     */
    constructor(){
        super('SousMarin', 14, 12, 3, 4, 4, 1, [1, 1]);
    }
}


/**
 * @augments Navire
 * @description Represent a Frigate a strong boat for long range*
 * <br>Here are the stats : 
 * <ul>
 *  <li>type -> Fregate</li>
 *  <li>sante -> 20</li> 
 *  <li>degat -> 4</li>
 *  <li>armure -> 8</li>
 *  <li>pm -> 3</li>
 *  <li>pa -> 6</li>
 *  <li>portee -> 3</li>
 *  <li>dimension -> [1, 3]</li>
 * </ul>
 */
export class Fregate extends Navire{
    /**
     * @constructs
     * 
     */
    constructor(){
        super('Fregate', 20, 4, 8, 3, 6, 3, [1, 3]);
    }
}

/**
 * @augments Navire
 * @description Represent a Transporter to resupply other boats*
 * <br>Here are the stats : 
 * <ul>
 *  <li>type -> Transporteur</li>
 *  <li>sante -> 1</li> 
 *  <li>degat -> 0</li>
 *  <li>armure -> 0</li>
 *  <li>pm -> 2</li>
 *  <li>pa -> 1</li>
 *  <li>portee -> 1</li>
 *  <li>dimension -> [1, 1]</li>
 * </ul>
 */

/**
 * TO DO
 * A ajouter dans Service pour permettre de le poser sur 
 * le plateau en même temps de le créer
 */
export class Transporteur extends Navire{
    /**
     * @constructs
     * 
     * @param {Int} x - Target to ressuply coordinate x
     * @param {Int} y - Target to ressuply coordinate y
     */
    constructor(x, y){
        super('Transporteur', 1, 0, 0, 2, 1, 1, [1, 1]);
        this.target = [x, y]
    }

    /**
     * @private
     */

}
