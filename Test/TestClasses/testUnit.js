import test from "node:test";
import assert from "assert";
import { Destroyer, Fregate, Navire, SousMarin } from "../../src/Models/Navire.js";
import Case from "../../src/Models/Case.js"
import Plateau from "../../src/Models/Plateau.js";
import Service  from "../../src/Services/Service.js";
import { log } from "console";

// tests/Navire.test.js

function testCreateDestroyer() {
    const destroyer = new Destroyer();
    assert.strictEqual(destroyer.type, 'Destroyer', "Type du navire devrait être 'Destroyer'");
    assert.strictEqual(destroyer.sante, 15, "Santé du Destroyer devrait être 15");
    assert.strictEqual(destroyer.degat, 2, "Dégâts du Destroyer devraient être 2");
  }
  
  function testCombatDestroyer() {
    const destroyer = new Destroyer();
    destroyer.setSante(0);
    assert.ok(destroyer.estDetruit(), "Le navire devrait être détruit quand la santé est à 0");
  }
  
  // Exécution des tests
  console.log("Tests pour Navire.js");
  testCreateDestroyer();
  testCombatDestroyer();
  console.log("Tous les tests de Navire.js ont réussi.");





// Tests pour la méthode isEqual de Navire
test('Navire: isEqual', { skip: false }, async (t) => {
    const navireDestr = new Navire('Destroyer', 15, 2, 5, 5, 2, 2, 10, 100, 10, 100, [1, 2]);
    const navireFreg = new Navire('Fregate', 20, 4, 8, 3, 6, 3, 15, 150, 15, 150, [1, 3]);

    await t.test('Should be equal', () => {
        assert.strictEqual(navireDestr.isEqual(navireDestr), true, "Le navire devrait être égal à lui-même");
    });

    await t.test('Should not be equal', () => {
        assert.strictEqual(navireDestr.isEqual(navireFreg), false, "Les navires de types différents ne devraient pas être égaux");
    });
});

// Tests pour les constructeurs de Navire
test('Constructors of Navire subclasses', { skip: false }, async (t) => {
    const navireDestr = new Navire('Destroyer', 15, 2, 5, 5, 2, 2, 10, 100, 10, 100, [1, 2]);
    const navireFreg = new Navire('Fregate', 20, 4, 8, 3, 6, 3, 15, 150, 15, 150, [1, 3]);
    const navireSsMarin = new Navire('SousMarin', 14, 12, 3, 4, 4, 1, 5, 50, 5, 50, [1, 1]);
    const destroyer = new Destroyer();
    const fregate = new Fregate();
    const ssMarin = new SousMarin();

    await t.test('Destroyer constructor validation', () => {
        assert.strictEqual(navireDestr.isEqual(destroyer), true);
    });
    
    await t.test('Fregate constructor validation', () => {
        assert.strictEqual(navireFreg.isEqual(fregate), true);
    });

    await t.test('SousMarin constructor validation', () => {
        assert.strictEqual(navireSsMarin.isEqual(ssMarin), true);
    });
});

// Tests pour la méthode estDetruit de Navire
test('Navire: estDetruit', { skip: false }, async (t) => {
    // Fournir un tableau pour `dimension`
    const testNavireDestroyed = new Navire('Destroyer', 0, 2, 5, 5, 2, 2, 10, 100, 10, 100, [1, 2]);
    const testNavireNDestroyed = new Navire('Destroyer', 15, 2, 5, 5, 2, 2, 10, 100, 10, 100, [1, 2]);

    await t.test('Is destroyed', () => {
        assert.strictEqual(testNavireDestroyed.estDetruit(), true, "Le navire devrait être détruit quand la santé est 0 ou moins");
    });

    await t.test('Isn\'t destroyed', () => {
        assert.strictEqual(testNavireNDestroyed.estDetruit(), false, "Le navire ne devrait pas être détruit quand la santé est positive");
    });
})
test('Navire: Creation et méthodes de base', async (t) => {
    // Test création de Destroyer avec ses attributs par défaut
    await t.test('Création de Destroyer', () => {
        const destroyer = new Destroyer();
        assert.strictEqual(destroyer.type, 'Destroyer', "Le type du navire devrait être 'Destroyer'");
        assert.strictEqual(destroyer.sante, 15, "La santé du Destroyer devrait être 15");
        assert.strictEqual(destroyer.degat, 2, "Les dégâts du Destroyer devraient être 2");
        assert.deepStrictEqual(destroyer.dimension, [1, 2], "Les dimensions du Destroyer devraient être [1, 2]");
    });

    // Test de la méthode estDetruit
    await t.test('Destroyer: estDetruit', () => {
        const destroyer = new Destroyer();
        destroyer.setSante(0);
        assert.ok(destroyer.estDetruit(), "Le navire devrait être détruit quand la santé est à 0 ou moins");
    });
});


// Tests pour la méthode estVide de Case
test('Case: estVide', { skip: false }, async (t) => {
    const testCaseVide = new Case(0, 0);
    const testCaseNVide = new Case(0, 0);
    testCaseNVide.contenu = new Destroyer();

    await t.test('Is empty', () => {
        assert.strictEqual(testCaseVide.estVide(), true);
    });

    await t.test('Isn\'t empty', () => {
        assert.strictEqual(testCaseNVide.estVide(), false);
    });
});

// Tests pour la méthode placerNavire de Case
// test('Case: placerNavire', { skip: false }, async (t) => {
//     const testCase = new Case(0, 0);
//     const testDestroyer = new Destroyer();

//     await t.test('Place a boat', () => {
//         testCase.placerNavire(testDestroyer);
//         assert.strictEqual(testCase.contenu.isEqual(testDestroyer), true);
//     });

//     await t.test('Place anything else', () => {
//         assert.throws(() => {
//             testCase.placerNavire("toto");
//         }, /TypeError/, "Shouldn't work with wrong type object");
//     });
// });

// Tests pour la méthode vider de Case
test('Case: vider', { skip: false }, (t) => {
    const testCaseNVide = new Case(0, 0);
    testCaseNVide.contenu = new Destroyer();
    assert.strictEqual(testCaseNVide.estVide(), false);

    testCaseNVide.vider();
    assert.strictEqual(testCaseNVide.estVide(), true);
});

// Tests pour le constructeur de Plateau
test('Constructor of Plateau', { skip: false }, async (t) => {
    await t.test('Normal board', async (t) => {
        const testPlateau = new Plateau(10, 15);

        await t.test('Attribute verification', () => {
            assert.strictEqual(testPlateau.nlong, 10);
            assert.strictEqual(testPlateau.nlarg, 15);
        });

        await t.test('Grid verification', async (t) => {
            await t.test('Grid type', () => {
                assert.ok(Array.isArray(testPlateau.grille), 'grille should be an object of type Array');
            });

            await t.test('Column number verification', () => {
                assert.strictEqual(testPlateau.grille.length, testPlateau.nlong);
            });

            await t.test('Grid content', () => {
                for (const colonne of testPlateau.grille) {
                    assert.ok(Array.isArray(colonne), 'Each element of the first dimension of grille should be an Array');
                    assert.strictEqual(colonne.length, testPlateau.nlarg);

                    for (const cell of colonne) {
                        assert.ok(cell instanceof Case, 'grille should contain in two dimensions Case object type');
                        assert.strictEqual(cell.estVide(), true);
                    }
                }
            });
        });
    });
});




test('Service: startGame (initialisation du plateau et des bases navales)', async (t) => {
    const service = new Service();
    service.startGame(); // Initialise le plateau et les bases navales pour les deux joueurs

    await t.test('Plateau est créé avec les dimensions correctes', () => {
        const plateau = service.getPlateau();
        assert.strictEqual(plateau.nlong, 15, "La longueur du plateau devrait être 15");
        assert.strictEqual(plateau.nlarg, 15, "La largeur du plateau devrait être 15");
    });

    await t.test('Les bases navales des deux joueurs sont correctement placées', () => {
        const baseJoueur1 = service.getBaseNavale(1);
        const baseJoueur2 = service.getBaseNavale(2);
        assert.ok(baseJoueur1, "La base du joueur 1 devrait être placée");
        assert.ok(baseJoueur2, "La base du joueur 2 devrait être placée");
    });
});


