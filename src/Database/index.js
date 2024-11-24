import Sql from "./Sql.js"

let database = new Sql();

database.getAllPlayers();
await database.addPlayer("toto", "titi");  // await très important
await database.addPlayer("toto", "sss");
await database.addPlayer("zz", "sssw");
await database.addPlayer("zsssz", "1234");

await database.login("toto", "titi");
await database.login("toto", "sss");
await database.login("fzfz", "titi");
database.getAllPlayers();
await database.removePlayer("toto", "titi");
await database.removePlayer("zsssz", "22");
await database.removePlayer("zsssz", "1234");


database.closeDatabase();