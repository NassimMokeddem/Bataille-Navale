import test from "node:test";
import assert from "assert";
import { Destroyer, Fregate, Navire, SousMarin } from "../../src/Models/Navire.js";
import Case from "../../src/Models/Case.js"
import Plateau from "../../src/Models/Plateau.js";

test('Navire: isEqual', {skip : false}, async(t) => {
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

test('Navire: estDetruit', {skip : false}, async (t) => {
    /*
    *  Initialisation des ressources
    */
    let testNavireDestroyed = new Navire('Destroyer', 0, 2, 5, 5, 2);
    let testNavireNDestroyed = new Navire('Destroyer', 15, 2, 5, 5, 2);

    /*
    *  Is destroyed
    */
    await t.test('Is destroyed', (t) => {
        assert.strictEqual( testNavireDestroyed.estDetruit(), true );
    })

    /*
    *  Isn't destroyed
    */
    await t.test('Isn\'t destroyed', (t) => {
        assert.strictEqual( testNavireNDestroyed.estDetruit(), false );
    })
})

test('Case: estVide', {skip : false}, async(t) => {
    /*
    *  Initialisation des ressources
    */
     let testCaseVide = new Case(0, 0);
     let testCaseNVide = new Case(0, 0);

     testCaseNVide.contenu = new Destroyer();
 
     /*
     *  Is empty
     */
     await t.test('Is empty', (t) => {
         assert.strictEqual( testCaseVide.estVide(), true );
     })
 
     /*
     *  Isn't empty
     */
     await t.test('Isn\'t empty', (t) => {
         assert.strictEqual( testCaseNVide.estVide(), false );
     })
})

test('Case: placerNavire', {skip : false}, async(t) => {
    /*
    *  Initialisation des ressources
    */
     let testCase = new Case(0, 0);

     let testDestroyer = new Destroyer();
 
     /*
     *  Place a boat
     */
     await t.test('Place a boat', (t) => {
     // Vérification si le bateau a bien été insérez dans la case
        try {
            testCase.placerNavire(testDestroyer);
            assert.strictEqual( testCase.contenu.isEqual(testDestroyer), true );
        }
        catch(err ) {
            assert.fail(err.message);
        }
     })
 
     /*
     *  Place anything else
     */
     await t.test('Place anything else', (t) => {
        try {
            testCase.placerNavire("toto");
            assert.fail('Shouldn\'t work with wrong type object');
        }
        catch(err ) {
            if (err instanceof Error) {
                assert.ok(err.message);
            } 
            assert.fail(err.message);
        }
     })
})

test('Case: vider', {skip : false}, (t) => {
    /*
    *  Initialisation des ressources
    */
    let testCaseNVide = new Case(0, 0);

    testCaseNVide.contenu = new Destroyer();
//  Vérification si case bien remplie
    assert.strictEqual( testCaseNVide.estVide(), false );

    testCaseNVide.vider();

//  Vérification si la case est bien vidée
    assert.strictEqual( testCaseNVide.estVide(), true);
})

/*
*   !!! COMMENTAIRES A RETIRER AVANT LA FIN DU PROJET !!!
*
*   Je mets toujours le constructeur de Plateau dans un try
*   car initialiserGrille doit pouvoir renvoyer une erreur
*   et donc le constructeur de Plateau aussi
*  
*/

test('Constructor of Plateau', {skip : false}, async(t) => {


     /*
     *  Normal board
     *  On va passer des arguments tout à fait normaux et
     *  vérifier si la grille a bien été construite
     */
     await t.test('Normal board', async(t) => {
        try {
            const testPlateau = new Plateau(10, 15);

            /*
            *  Attributes verification
            */
            await t.test('Attribute verification', (t) => {
                assert.strictEqual( testPlateau.nlong, 10 );
                assert.strictEqual( testPlateau.nlarg, 15 );
            })
    
            /*
            *  Grid verification
            */
           await t.test('Grid verification', async (t) => {
    
               /*
               *  Grid type
               */
               await t.test('Grid type', (t) => {
                   if(! Array.isArray(testPlateau.grille) ) assert.fail('grille should be an object of type Array');
               })
    
               /*
               *  Column number verification
               */
               await t.test('Column number verification', (t) => {
                   assert.strictEqual( testPlateau.grille.length, testPlateau.nlong );
               })
        
               /*
               *   Grid content
               */
               await t.test('Grid content', (t) => {
                   for (const colonne of testPlateau.grille) {
                       if(! Array.isArray(colonne) ) assert.fail('Each element of the first dimension of grille should be an Array');
           
                   //  Vérification du nombre de ligne
                       assert.strictEqual( colonne.length, testPlateau.nlarg );
           
                       for(const cell of colonne){
                           if(! cell instanceof Case) assert.fail('grille should contain in two dimension Case object type');
                           assert.strictEqual( cell.estVide(), true );
                       }
                   }
               })
            })
        }

        catch(err ) {
            /*
            *   !!! TO DO !!!
            *   Vérifiez que le message d'erreur renvoyer par le constructeur
            *   n'est pas le même que pour initialiserGrille pour bien voir que
            *   le constructeur catch l'erreur
            */

            assert.fail(err.message);
        }

     })
})