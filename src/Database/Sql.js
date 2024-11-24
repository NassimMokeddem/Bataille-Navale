import Database from "better-sqlite3";
import bcrypt from "bcrypt";

export default class Sql{
    constructor(){
        this.initializeDatabase();
    }

    initializeDatabase(){
        this.db = new Database('./src/Database/db/players.db');
        console.log("database open")

        this.db.exec("CREATE TABLE IF NOT EXISTS players (name STRING PRIMARY KEY, password STRING)");
        console.log("table 'players' created")
    }

    async addPlayer(name, password){
        if(this.nameTaken(name)){
            console.log(`nom déja pris, not add: ${name}`);
            return;
        }

        if(name.length < 4){
            console.log(`nom trop court, au moins 4 caracteres, not add: ${name}`)
            return;
        }

        if(name.length > 13){
            console.log(`nom trop long, au plus 12 caracteres, not add: ${name}`)
            return;
        }

        if(password.length < 4){
            console.log(`password trop court, au moins 4 caracteres, not add: ${name}`)
            return;
        }

        if(password.length > 13){
            console.log(`password trop long, au plus 12 caracteres, not add: ${name}`)
            return;
        }
        
        const hash = await bcrypt.hash(password, 13);
        
        const insertData = this.db.prepare("INSERT INTO players (name, password) VALUES (?, ?)");
        insertData.run(name, hash);

        console.log(`add OK: ${name}`);
    }

    closeDatabase(){
       this.db.close();
       console.log("database closed")
    }

    async login(name, password){
        if(!this.nameTaken(name)){
            console.log(`nom pas dans la base de donnees, not login: ${name}`);
            return;
        }
        const isValid = await bcrypt.compare(password, this.getPlayerPassword(name));
        if(!isValid){
            console.log(`wrong password, not login: ${name}`);
            return;
        }
        console.log(`login ok: ${name}`);
    }

    nameTaken(name){
        const user = this.db.prepare(`SELECT * FROM players WHERE name = ?`).get(name);
        try{
            if(typeof user.name !== 'undefined'){
                return true;
            }
        }
        catch{
            return false;
        }
    }

    getPlayerPassword(name){
        const getPassword = this.db.prepare("SELECT password FROM players WHERE name = ?");
        return getPassword.get(name).password;
    }

    getAllPlayers(){ // afficher password ?
        const users = this.db.prepare(`SELECT name, password FROM players`).all();
        if(users.length === 0){
            console.log("base de données vide, aucun user")
        }
        console.log(users);
    }

    async removePlayer(name, password){ // if login alors remove -> deconnexion OU if login not remove
        if(!this.nameTaken(name)){
            console.log(`nom pas dans la base de donnees, not delete: ${name}`);
            return;
        }
        const isValid = await bcrypt.compare(password, this.getPlayerPassword(name));
        if(!isValid){
            console.log(`wrong password, not delete: ${name}`);
            return;
        }
        const removeData = this.db.prepare(`DELETE FROM players WHERE name = ?`);
        removeData.run(name);
        console.log(`delete OK : ${name}`);
    }
}
