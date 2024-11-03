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
		}else if(Socket.Partie[partieID].joueur2 !== undefined){
			player.socket.emit('ERROR', 'partie pleine');
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
				if(this.service.buyNavire(tour?2:1, data.type, data.x, data.y) === 'Pas assez d\'argent')
					throw new Error('Not enough money');
				player.socket.emit('boatAcquired', this.service.getPlateau());
				tour?this.joueur1.socket.emit('boatAcquired', this.service.getPlateau()):this.joueur2.socket.emit('boatAcquired', this.service.getPlateau())

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

			try{
				let def = this.service.tirer(data.xAttaquant, data.yAttaquant, data.xDefenseur, data.yDefenseur, tour?2:1);
				player.socket.emit('navireEndommage', def);
				tour?this.joueur1.socket.emit('navireEndommage', def):this.joueur2.socket.emit('navireEndommage', def)

				console.log('Boat at ', data.xAttaquant, data.yAttaquant, ' shoot on boat ', data.xDefenseur, data.yDefenseur, ' in room ', this.partieID, ' from player ', tour?2:1);
			}
			catch(err ){
				if(err.message == 'Wrong argument type attaquant (Base) in Plateau: tirerNavire'){
					player.socket.emit('ERROR', 'You can\'t fire with your base');
					return
				}

				if(err.message == 'Wrong argument type defenseur (Base) in Plateau: tirerNavire'){
					player.socket.emit('ERROR', 'You can\'t fire on a base');
					return
				}

				if(err.message == 'Wrong argument type attaquant in Plateau: tirerNavire'){
					player.socket.emit('ERROR', 'You\'re firing with something uninentified');
					return
				}

				if(err.message == 'Wrong argument type defenseur in Plateau: tirerNavire'){
					player.socket.emit('ERROR', 'You\'re firing on something unidentified');
					return
				}

				if(err.message == 'The attacker doesn\'t have enough range'){
					player.socket.emit('ERROR', err.message);
					return
				}

				else{
					player.socket.emit('ERROR', 'Unspecified error')
					console.log(err.message)
				}

			}
		});

		player.socket.on('navireDeplace', (data) =>{
			if(this === undefined || tour !== this.tour){
				player.socket.emit('ERROR', 'c\'est pas ton tour !');
				return;
			}

			try{
				this.service.moveNavire(data.xNavire, data.yNavire, data.xDeplacement, data.yDeplacement, tour?2:1);
				player.socket.emit('navireArrive', this.service.getPlateau());
				tour?this.joueur1.socket.emit('navireArrive', this.service.getPlateau()):this.joueur2.socket.emit('navireArrive', this.service.getPlateau())

				console.log('Boat at ', data.xNavire, data.yNavire, ' moved to ', data.xDeplacement, data.yDeplacement, ' in room ', this.partieID, ' from player ', tour?2:1);
			}
			catch(err ){
				if(err.message == 'Wrong argument type navire (Base) in Plateau: moveNavire'){
					player.socket.emit('ERROR', 'You can\'t move a base');
					return
				}

				if(err.message == 'Bad argument navire in BaseNavale: moveNavire'){
					player.socket.emit('ERROR', 'You\'re trying to move something unidentified');
					return
				}

				if(err.message == 'resupplyNavire -> Le navire ne vous appartient pas'){
					player.socket.emit('ERROR', 'You\'re can only move your own boats');
					return
				}

				if(err.message == 'Déplacement impossible'){
					player.socket.emit('ERROR', 'You can\'t place your boat here');
					return
				}

				if(err.message == 'Pas assez de point de déplacement'){
					player.socket.emit('ERROR', err.message);
					return
				}

				else{
					player.socket.emit('ERROR', 'Unspecified error')
					console.log(err.message)
				}

			}
		});

		player.socket.on('finDeTour', () => {
			if(this === undefined || tour !== this.tour){
				player.socket.emit('ERROR', 'c\'est pas ton tour !');
				return;
			}
			this.tour = (this.tour + 1) % 2;
			
			this.service.updateFood(tour?2:1);

			this.joueur1.socket.emit('Tour', 'Tour du Joueur ' + (this.tour?'2':'1'));
			this.joueur2.socket.emit('Tour', 'Tour du Joueur ' + (this.tour?'2':'1'));

			this.joueur1.socket.emit('TourD', this.service.getPlateau());
			this.joueur2.socket.emit('TourD', this.service.getPlateau());
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
