import test from "node:test";
import assert from "assert";
import { Destroyer, Fregate, Navire, SousMarin } from "../../src/Models/Navire.js";

test('Navire: isEqual', {skip: false}, async(t) => {
    /*
    *  Initialisation des ressources
    */
    let navireDestr = new Navire('Destroyer', 15, 2, 5, 5, 2);
    let navireFreg = new Navire('Fregate', 20, 4, 8, 3, 6);

    /*
    *  Will be equal
    */
    await t.test('Will be equal', (t) => {
        assert.strictEqual( navireDestr.isEqual(navireDestr), true);
    })

    /*
    *  Won't be equal
    */
    await t.test('Won\'t be equal', (t) => {
        assert.strictEqual( navireDestr.isEqual(navireFreg), false);
    })
})

test('Constructors of Navire', {skip : false}, async (t) => {
    /*
    *  Initialisation des ressources
    */
    let navireDestr = new Navire('Destroyer', 15, 2, 5, 5, 2);
    let navireFreg = new Navire('Fregate', 20, 4, 8, 3, 6);
    let navireSsMarin = new Navire('SousMarin', 14, 12, 3, 4, 4);
    let destroyer = new Destroyer();
    let fregate = new Fregate();
    let ssMarin = new SousMarin();

    
    /*
    *  Vérification constructeur Destroyer 
    */
    await t.test('constructor destroyer right constructor', (t) => {
        assert.strictEqual( navireDestr.isEqual(destroyer), true);
    });
    
    await t.test('constructor destroyer wrong constructor', (t) => {
        assert.strictEqual( navireDestr.isEqual(fregate), false);
        assert.strictEqual( navireDestr.isEqual(ssMarin), false);
    });

    /*
    *  Vérification constructeur Fregate
    */
    await t.test('constructor fregate right constructor', (t) => {
        assert.strictEqual( navireFreg.isEqual(fregate), true);
    });
    
    await t.test('constructor fregate wrong constructor', (t) => {
        assert.strictEqual( navireFreg.isEqual(destroyer), false);
        assert.strictEqual( navireFreg.isEqual(ssMarin), false);
    });

    /*
    *  Vérification constructeur SousMarin
    */
    await t.test('constructor sous-marin right constructor', (t) => {
        assert.strictEqual( navireSsMarin.isEqual(ssMarin), true);
    });
    
    await t.test('constructor sous-marin wrong constructor', (t) => {
        assert.strictEqual( navireSsMarin.isEqual(fregate), false);
        assert.strictEqual( navireSsMarin.isEqual(destroyer), false);
    });
});