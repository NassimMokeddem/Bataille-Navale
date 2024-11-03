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
		console.log('Player joining room ', partieID);

		Socket.Partie[partieID].initPlayer(player, 1);
	}

	constructor(joueur1, partieID){

		if(Socket.Partie[partieID] !== undefined){
			joueur1.socket.emit('ERROR', new Error('PartieID déjà utilisé'));
			// pas certains de ça
			delete this;
			return;
		}

		this.service = new Service();

		Socket.Partie[partieID] = this;

		this.tour = 0;

		this.partieID = partieID;

		this.partieDebut = true;


		console.log('Creating room ', partieID);

		this.initPlayer(joueur1, 0);

	}

	#sendOtherPlayer(tour){
		tour?this.joueur1.socket.emit('boatAcquired', this.service.getPlateau()):this.joueur2.socket.emit('boatAcquired', this.service.getPlateau());
	}

	initPlayer(player, tour){
		
		tour?this.joueur2=player:this.joueur1=player;

		// Début de partie
		if(this.partieDebut && this.joueur1 !== undefined && this.joueur2 !== undefined){
			this.service.startGame()
			this.joueur1.socket.emit('game created', this.service.getPlateau());
			this.joueur2.socket.emit('game created', this.service.getPlateau());
			this.partieDebut = false;
		}

		this.#moveRoom(player);

		player.socket.on('disconnect', () => {
			if(this === undefined) 
				return;
			this.win(tour?0:1);
		});


		player.socket.on('placeNavire', (data) =>{
			if(this === undefined || tour !== this.tour){
				player.socket.emit('ERROR', 'c\'est pas ton tour !');
				return;
			}

			try{
				if(this.service.buyNavire(data.idJoueur, data.type, data.x, data.y) == 'Pas assez d\'argent')
					throw new Error('Not enough money');
				player.socket.emit('boatAcquired', this.service.getPlateau());
				this.#sendOtherPlayer(tour);

				console.log('Boat purchased in room ', this.partieID, ' from player ', data.idJoueur);
			}
			catch(err ){
				if(err.message == 'Bas argument type in Service: buyNavire'){
					player.socket.emit('ERROR', 'You passed a bad boat type');
					return
				}

				if(err.message == 'You can\'t place a boat that you bought outside of your territory'){
					player.socket.emit('ERROR', err.message);
					return
				}

				if(err.message == 'You can\'t place a boat here. Not enough space'){
					player.socket.emit('ERROR', err.message);
					return
				}

				if(err.message == 'Not enough money'){
					player.socket.emit('ERROR', err.message);
					return
				}

				else{
					player.socket.emit('ERROR', 'Unspecified error')
					console.log(err.message)
				}
			}
		});

		player.socket.on('navireAttaque', (data) =>{
			if(this === undefined || tour !== this.tour){
				player.socket.emit('ERROR', 'c\'est pas ton tour !');
				return;
			}
			//TODO le navire attaque, data{navire: navire, x: posx, y: posy}
		});

		player.socket.on('navireDeplace', (data) =>{
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
