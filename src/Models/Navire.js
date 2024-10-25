/**
 * @class
 * @property {String} type - Type of boat
 * @property {Int} sante - Lifepoint of a boat
 * @property {Int} degat - Damage of the boat
 * @property {Int} armure - Armor of the boat
 * @property {Int} pm - Move points of the boat
 * @property {Int} pa - Action points of the boat
 * @property {Int} portee - Range of the boat
 * @property {Int} equipage - Number of crew members
 * @property {Int} nourriture - Amount of food supplies
 * @property {Int} maxEquipage - Max Number of crew members
 * @property {Int} maxNourriture - Max Amount of food supplies
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
    constructor(type, sante, degat, armure, pm, pa, portee, equipage, nourriture, maxEquipage, maxNourriture) {
        this.type = type;
        this.sante = sante;
        this.degat = degat;
        this.armure = armure;
        this.pm = pm;
        this.pa = pa;
        this.portee = portee;
        this.equipage = equipage;
        this.nourriture = nourriture;
        this.maxEquipage = maxEquipage;
        this.maxNourriture = maxNourriture;
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
            obj.portee != this.portee ) return false;
            
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
    setSante(sante){ this.sante = sante }
    
    /**
     * Replenishes the food supplies up to the maximum capacity
     * @param {Int} quantite - The amount of food to add
     */
    reapprovisionnerNourriture(quantite) {
        if (quantite < 0) throw new Error("La quantité ne peut pas être négative.");
        
        this.nourriture = Math.min(this.nourriture + quantite, this.maxNourriture);
    }

    /**
     * @returns {Int} Returns the number of crew members
     */
    getEquipage() { return this.equipage; }

    /**
     * @returns {Int} Returns the amount of food supplies
     */
    getNourriture() { return this.nourriture; }

    /**
     * @returns {Int} Returns the maximum crew capacity
     */
    getMaxEquipage() { return this.maxEquipage; }

    /**
     * @returns {Int} Returns the maximum food capacity
     */
    getMaxNourriture() { return this.maxNourriture; }

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
 * </ul>
 */
export class Destroyer extends Navire{
    /**
     * @constructs
    */
    constructor(){
        super('Destroyer', 15, 2, 5, 5, 2, 2, 10, 100, 10, 100);
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
 * </ul>
 */
export class SousMarin extends Navire{
    /**
     * @constructs
     */
    constructor(){
        super('SousMarin', 14, 12, 3, 4, 4, 1, 5, 50, 5, 50);
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
 * </ul>
 */
export class Fregate extends Navire{
    /**
     * @constructs
     * 
     */
    constructor(){
        super('Fregate', 20, 4, 8, 3, 6, 3, 15, 150, 15, 150);
    }
}
