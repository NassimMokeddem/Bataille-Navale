import Service from '../Services/Service.js';
/**
 * @class
 * @property {String} instanceId - Le nom de l'instance de jeu
 * @property {Socket} socket - La socket, permet l'échange de données 
 * @property {IO} io - Permet la communication avec les membres de l'instance
 * */

export class Socket{

	static Partie = {};
	static joinPartie(player, partieID){
		if(Socket.Partie[partieID] === undefined){
			player.socket.emit('ERROR', 'partieID inconnu');
			return;
		}
		Socket.Partie[partieID].initPlayer(player, 1);
	}

	constructor(player, partieID){

		if(Socket.Partie[partieID] !== undefined){
			player.socket.emit('ERROR', new Error('PartieID déjà utilisé'));
			// pas certains de ça
			delete this;
			return;
		}

		this.service = new Service();

		this.tour = 0;

		this.initPlayer(joueur1, 0);

		Socket.Partie[partieID] = this;
	}

	initPlayer(player, tour){
		
		tour?this.joueur2=player:this.joueur1=player;

		this.moveRoom(player);

		this.socket.on('disconnect', () => {
			if(this === undefined) 
				return;
			this.win(tour?0:1);
		});

		this.socket.on('placeNavire', (data) =>{
			if(this === undefined || tour !== this.tour){
				player.socket.emit('ERROR', 'c\'est pas ton tour !');
				return;
			}
			//TODO placer un navire
		});

		this.socket.on('navireAttaque', (data) =>{
			if(this === undefined || tour !== this.tour){
				player.socket.emit('ERROR', 'c\'est pas ton tour !');
				return;
			}
			//TODO le navire attaque, data{navire: navire, x: posx, y: posy}
		});

		this.socket.on('navireDeplace', (data) =>{
			if(this === undefined || tour !== this.tour){
				player.socket.emit('ERROR', 'c\'est pas ton tour !');
				return;
			}
			//TODO le navire est déplacé, data{navire: navire, action: up/down/left/right/rotateL/rotateR}
		});

	}

	win(tour){
		this.joueur1.socket.emit(tour?'Perdu':'Gagné');
		this.joueur2.socket.emit(tour?'Gagné':'Perdu');

		// réinitialiser les sockets ? juste les socket.on ? Risque de crash si une socket envoie une commande ? 
		// test avec this === undefined, on croise les doigts ?

		delete this; // Vérifier que ça delete bien Socket.Partie[partieID]
	}

	#moveRoom(player){
		player.socket.join(this.partieID);
		player.socket.leave(player.partieID);
		player.partieID = this.partieID;
	}

}
