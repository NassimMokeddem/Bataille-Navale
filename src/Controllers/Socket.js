/**
 * @class
 * @property {String} instanceId - Le nom de l'instance de jeu
 * @property {Socket} socket - La socket, permet l'échange de données 
 * @property {IO} io - Permet la communication avec les membres de l'instance
 * */

function socket(io, service){
    io.on('connection', (socket) =>{
        console.log(socket.id + ' connected')

        service.startGame();
        socket.emit('game created', service.getPlateau());

        socket.on('addBoat', (data) => {
            service.buyNavire(data.idJoueur, data.type)
            socket.emit('boatAcquired', service.getPlateau());
        })

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });
}

export default socket;

export class Socket{

    constructor(socket, io){
        this.socket = socket;
        this.io = io;
        
        this.moveRoom('Lobby');

        this.socket.on('newGame', (id) => {
            //TODO création d'une nouvelle instance de jeu
        });
        
        this.socket.on('joinGame', (id) =>{
            //TODO rejoindre une instance existante
        });

        this.socket.on('disconnect', () => {
            //TODO le joueur se déconnecte
        });

        this.socket.on('placeNavire', (navire) =>{
            //TODO placer un navire
        });

        /*
         *  Il va falloir prendre en compte que
         *  le plateau du joueur2 est à l'envers
         * */

        this.socket.on('navireAttaque', (data) =>{
            //TODO le navire attaque, data{navire: navire, x: posx, y: posy}
        });

        this.socket.on('navireDeplace', (data) =>{
            //TODO le navire est déplacé, data{navire: navire, action: up/down/left/right/rotateL/rotateR}
        });
    }


    /**
     *  Ne pas utiliser, uniquement utiliser dans newGame et joinGame
     */
    #moveRoom(instance){
        this.socket.join(instance);
        this.socket.leave(this.instanceId);
        this.instanceId = instance;
    }

}
