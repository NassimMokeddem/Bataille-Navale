import test from "node:test";
import assert from "assert";
import supertest from "supertest";

let adressAPI = 'http://localhost:3000';

test('Test API', {skip : false}, (t) => {
    supertest(adressAPI).get('/partie/').end(function(err, res) {
        if (err) throw err;
        console.log(res.text);
    })
});