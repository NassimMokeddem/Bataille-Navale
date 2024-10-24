/**
 * @module Case
 */

/**
 * @property {Int} x - The x coordinate of the cell
 * @property {Int} y - The y coordinate of the cell
 * 
 * 
 * 
 * @description Represent a cell
*/
export default class Case{
    /**
     * @constructs
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.contenu = null
    }

    /**
     * @private
     */
    getX(){ return this.x }

    /**
     * @private
     */
    getY(){ return this.y }

    /**
     * @private
     */
    getContenu(){ return this.contenu }

    /**
     * @public
     * @returns {boolean} - Returns if the cell content is empty or not
     */
    estVide(){
        return this.contenu === null;
    }

    /**
     * @public
     * @param {obj} navire - The object to place in the content of the cell 
     */
    placerNavire(navire){
        this.contenu = navire;
    }

    /**
     * @public
     * @description Empty the content of the cell by putting it to null
     */
    vider(){
        this.contenu = null;
    }
}