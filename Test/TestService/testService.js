import test from "node:test";
import assert from "assert";
import Service from "../../src/Services/Service.js";
import { Navire } from "../../src/Models/Navire.js";

test('Service: updatePlateau', {skip : false}, async (t) => {
    /*
    *  Initialize the Service and the resources that we will need
    */

    const testBoat = new Navire('Test_Boat', 10, 1, 2, 3, 2);
    const testService = new Service();

    testService.createPlateau(15, 15);

    /*
    *  Testing with normal coordinates and normal object
    */
    await t.test('Normal behavior', (t) => {
        try {
            testService.updatePlateau(0, 0, testBoat);
        }
        catch(err ) {
        //  Testing if the Service throws an Error object
            if (err instanceof Error) {
                if (err.message === "Invalid coordinates") assert.fail('The method of Service.js: updatePlateau should catch the error thrown by Plateau.js : setCaseContent');
                //  The Service detected the bad behavior and throwed the right error 
                assert.fail(err.message);
            }
            assert.fail('Bad type error thrown by Service.js: updatePlateau');
        }
    })

    /*
    *  Testing with bad coordinates but good object
    */
    await t.test('Error on coordinates', (t) => {
        try{
            testService.updatePlateau(-1, -1, testBoat);
            assert.fail('Shouldn\'t work with wrong coordinates');
        }
        catch(err ) {
            if (err instanceof Error) {
                if (err.message === "Invalid coordinates") assert.fail('The method of Service.js: updatePlateau should catch the error thrown by Plateau.js : setCaseContent')
                assert.ok();
            } 
            assert.fail('Bad type error thrown by Service.js: updatePlateau');
        }
    })
})