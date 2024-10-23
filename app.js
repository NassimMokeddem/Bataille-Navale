const NombreDeNavires = 1;
const TailleDuPlateau = 15;
const TailleNavireMax = 15;

export class Joueur {
    constructor(socket, io){
        this.socket = socket;
        this.io = io;
        


        this.gameId = 'lobby';
        
        this.socket.join(this.gameId);

        this.socket.emit('chat message', 'tu es connecté');

        this.socket.on('chat message', (msg) => this.chatMessage(msg));
        this.socket.on('disconnect', () => this.playerDisconnect());
        this.socket.on('newGame', () => this.newGame());
        this.socket.on('joinGame', (gameId) => this.joinGame(gameId));
        this.socket.on('place', (data) => this.placeNavire(data));
        this.socket.on('tirer', (coord) => this.tirer(coord));
    };

    async newGame(){
        let gameId = ((Math.random() * 100000) | 0).toString();
        this.plateau = new Array(TailleDuPlateau);
        for(let i = 0; i < TailleDuPlateau; i++){
            this.plateau[i] = new Array(TailleDuPlateau).fill(0, 0, TailleDuPlateau);
        }
        this.socket.join(gameId);
        this.socket.leave(this.gameId);
        this.playerQuit();
        this.gameId = gameId;
        console.log('Room : ' + this.gameId);
        this.socket.emit('newGame', {gameId: this.gameId, socketId: this.socket.id});
        await addPlayer1Rooms(this.gameId, this);
        this.tour = 0;
        this.adv = 1;
        this.nbNavire = NombreDeNavires;
    };

    async joinGame(gameId){
        const sock = await this.io.in(gameId).fetchSockets();
        if(sock.length > 0){
            if(sock.length >= 2) {
                this.socket.emit('fullRoom');
            } else {
                this.tour = 1;
                this.plateau = new Array(TailleDuPlateau);
                for(let i = 0; i < TailleDuPlateau; i++){
                    this.plateau[i] = new Array(TailleDuPlateau).fill(0, 0, TailleDuPlateau);
                }
                this.adv = 0;
                this.socket.join(gameId);
                this.socket.leave(this.gameId);
                this.playerQuit();
                this.gameId = gameId;
                this.socket.emit('join', this.socket.id);
                this.io.to(this.gameId).emit('dPlacement');
                addPlayer2Rooms(this.gameId, this);
                this.nbNavire = NombreDeNavires;
            }
        } else {
            this.socket.emit('noRoom');
        }
    };

    place(coord){
        let xmin = Math.min(coord[0], coord[2]);
        let xmax = Math.max(coord[0], coord[2]);
        let ymin = Math.min(coord[1], coord[3]);
        let ymax = Math.max(coord[1], coord[3]);
        
        if( (xmax - xmin + ymax - ymin + 1) > this.nbNavire ){
            this.socket.emit('badPlacement', {navires: this.nbNavire, place: false, nb: true});
            return;
        }

        for(let i = xmin ; i <= xmax ; i++){
            for(let j = ymin ; j <= ymax ; j++){
                if(this.plateau[i][j] !== 0){
                    this.socket.emit('badPlacement', {navires: this.nbNavire, place: true, nb: false});
                    return;
                }
            }
        }
        
        for(let i = xmin; i <= xmax && this.nbNavire > 0; i++){
            for(let j = ymin ; j <= ymax ; j++){
                this.plateau[i][j] = 1;
                this.nbNavire--;
            }
        }
        this.socket.emit('plateau', {dimx: TailleDuPlateau, dimy: TailleDuPlateau, plateau: this.plateau} );
        if(this.nbNavire === 0){
            this.socket.emit('fPlacement');
            fPlaceNav(this.gameId, this.tour, this.io);
        }
    };


    placeNavire(data){
        if(! rooms[this.gameId].partie[0]){
            this.socket.emit('badPlacement', {navires: this.nbNavire, place: false, nb: false});
        } else if (this.nbNavire === 0){
            this.socket.emit('fPlacement');
        } else {
            let coord = [parseInt(data.x1, 10), parseInt(data.y1, 10), parseInt(data.x2, 10) , parseInt(data.y2, 10)];
            for(let i = 0; i < 4; i++){
                if(isNaN(coord[i]) || coord[i] < 0 || coord[i] >= TailleDuPlateau){
                    this.socket.emit('badPlacement', {navires: this.nbNavire, place: true, nb: false});
                    return;
                }
            }

            if(coord[0] === coord[2] && (coord[1] - coord[3]) < TailleNavireMax && (coord[3] - coord[1]) < TailleNavireMax){
                this.place(coord);
            } else if(coord[1] === coord[3] && (coord[0] - coord[2]) < TailleNavireMax && (coord[2] - coord[0]) < TailleNavireMax) {
               this.place(coord);
            } else {
                this.socket.emit('badPlacement', {navires: this.nbNavire, place: true, nb: false});
            }
        }
    }

    tirer(data){
        let coord = [parseInt(data.x, 10), parseInt(data.y, 10)];
        if(!rooms[this.gameId].partie[1] || rooms[this.gameId].tour != this.tour || isNaN(coord[0]) || isNaN(coord[1]) || coord[0] >= TailleDuPlateau || coord[1] >= TailleDuPlateau || coord[0] < 0|| coord[1] < 0){
            this.socket.emit('badAim');
            return;
        }
        let plat = [rooms[this.gameId].plateau1, rooms[this.gameId].plateau2];
        let adv = [rooms[this.gameId].nbNav1, rooms[this.gameId].nbNav2];

        if(plat[this.adv][coord[0]][coord[1]] === 1){
            adv[this.adv]--;
            console.log(adv[this.adv]);
            if(adv[this.adv] === 0){
                gagnant(this.tour, this.adv, this.gameId);
                return;
            }
            this.io.to(this.gameId).emit('fTour', {val: true, x: coord[0], y: coord[1]});
        }else if(plat[this.adv][coord[0]][coord[1]] === 2){
            this.socket.emit('badAim');
            return;
        }else{
            this.io.to(this.gameId).emit('fTour', {val: false, x: coord[0], y: coord[1]});
        }
        passTour(this.tour, this.gameId);
    }

    chatMessage(msg){    
        console.log('['+ this.gameId +']' +this.socket.id + ' : ' + msg );
        this.io.to(this.gameId).emit('chat message', ('['+ this.gameId +']' + this.socket.id + ' : ' + msg));
    };

    async playerDisconnect(){
        console.log(this.gameId + ' : ' + this.socket.id + ' disconnected');
        this.io.to(this.gameId).emit('chat message', (this.socket.id + ' is now offline'));
        this.socket.leave(this.gameId);
        this.playerQuit();
    };

    playerQuit(){
        if(this.gameId !== 'lobby'){
            this.io.to(this.gameId).emit('fGame', {win: true});
            finPartie(this.io, this.gameId, this.adv);
        }
    }

    moveRoom(room){
        this.socket.join(room);
        this.socket.leave(this.gameId);
        this.gameId = room;
    }
};

let rooms = {};

rooms['lobby'] = {partie: [false,false]};

async function addPlayer1Rooms(room, player){
    rooms[room] = {
        player1: player.socket.id,
        player2: null,
        s1: player,
        s2: null,
        plateau1: player.plateau,
        plateau2: {},
        nbNav1: NombreDeNavires,
        nbNav2: NombreDeNavires,
        tour: 0,
        state: [false, false],
        partie: [false,false]
    };
    player.plateau = rooms[room].plateau1;
    console.log(rooms[room].player1 + ' added to the room');
};

async function addPlayer2Rooms(room, player){
    rooms[room].player2 = player.socket.id;
    rooms[room].s2 = player;
    rooms[room].plateau2 = player.plateau;
    rooms[room].partie = [true,false];
};

async function fPlaceNav(room, tour, io){
    rooms[room].state[tour] = true;
    if(rooms[room].state[0] && rooms[room].state[1]){
        io.to(room).emit('dTirer');
        rooms[room].partie = [false, true];
        rooms[room].s1.socket.emit('tour', true);
        rooms[room].s2.socket.emit('tour', false);
    }
}

async function gagnant(gagnant, adv, room){
    let r = [rooms[room].s1, rooms[room].s2];
    r[gagnant].socket.emit('fGame', true);
    r[adv].socket.emit('fGame', false);
    r[gagnant].moveRoom('lobby');
    r[adv].moveRoom('lobby');
    r[gagnant].io.in(room).socketsLeave();
    rooms[room] = {};
}

async function finPartie(io, room, adv){
    if(rooms[room] != null){
        let socks = [rooms[room].s1, rooms[room].s2];
        if(socks[adv] != null){
            socks[adv].moveRoom('lobby');
        }
        io.in(room).socketsLeave();
        rooms[room] = {};
    }
};

async function passTour(tour, room){
    if(tour === 0){
        rooms[room].s1.socket.emit('tour', false);
        rooms[room].tour = 1;
        rooms[room].s2.socket.emit('tour', true);
    }else{
        rooms[room].s2.socket.emit('tour', false);
        rooms[room].tour = 0;
        rooms[room].s1.socket.emit('tour', true);
    }
};



