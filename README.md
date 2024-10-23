# Back-end : Bataille Navale

# installation : npm i
# lancer : npm start 

# Les constante TailleDuPlateau, NombredeNavires et TailleNavireMax dans app.js tout en haut, les changer en cas de besoin
[Socket.io](https://socket.io/)



#### Recevoir des données du serveur 
```js
/*
    @NomDuPaquetReçu : Un string pour différencier les différents paquets
    @args : Le contenu du paquet, peut juste être une valeur, un JSON ou une suite de valeurs
            (args1, args2, {val1: 1, val2: 2})
*/
socket.on('NomDuPaquetReçu', (args..) => { Les instructions });
// Si l'instruction est juste une fonction
socket.on('NomDuPaquetReçu', (args..) => fonction(args..));
// S'il faut recevoir plusieurs valeurs
socket.on('NomDuPaquetReçu', (arg1, arg2, arg3) => { Les instructions }});
// S'il n'y a pas de valeur à recevoir
socket.on('NomDuPaquetReçu', () => { Les instructions });
```


#### Envoyer des données au serveur
```js
/*
    @NomDuPaquetEnvoyé : Un string pour différencier les différents paquets
    @args : Les données à envoyer
*/
socket.emit('NomDePaquetEnvoyé', args..);
// Cas de plusieurs valeurs
socket.emit('NomDePaquetEnvoyé', arg1, arg2, arg3);
// Pour un JSON fait sur le tas
socket.emit('NomDuPaquetEnvoyé', {val1: 1, val2: 2});
// Le paquet est un signal
socket.emit('NomDuPaquetEnvoyé');
```


#### Pour pouvoir utiliser socket.io côté client
```js
<script src="/socket.io/socket.io.js"></script>
// OU si tu veux pas que le serveur envoie la library
<script src="https://cdn.socket.io/4.7.5/socket.io.min.js"></script>

// Ne pas oublier d'initialiser la socket dans le script
<script>
const socket = io();
.
.
.
socket.on('chat message', (msg) => { // Reçoie un 'chat message' du serveur dans les données (msg)
  socket.emit('bienReçu'); // Envoie un 'bienReçu' au serveur
  console.log(msg); // Juste une autre instruction
});
</script>
```



### En Bonus - front_test/index.html pour un peu mieux comprendre comment ça fonctionne



## API



**Les noms des variables peuvent être changé, tant que le contenu ne l'est pas**



### socket.on - Les messages de la part du serveur



**'chat message'** : Dans le tuto socket.io, il faut dev une chatroom, plus un chat, c'est toujours sympa
**(msg)** : Le message reçu


**'newGame'** : Reçu après la création d'une nouvelle partie
**(data)** : {gameId: val, socketId: val}, gameId le nom de l'instance, socketId.. aucun intérêt, mais sera remplacé par le username plus tard


**'join'** : Un joueur à rejoint l'instance
**(player)** : L'identifiant du joueur


**'noRoom'** : L'instance que t'as tenté de rejoindre n'existe pas (msg d'erreur)


**'fullRoom'** : L'instance que t'as tenté de rejoindre est pleine (2joueurs max)


**'dPlacement'** : Le joueur peut placer ses navires sur la map


**'fPlacement'** : Le joueur ne peut plus placer de navires sur la map


**'badPlacement'** : Message d'erreur, le navire ne peut pas être placé à cet endroit (déjà un navire, hors de la map, ou pas dans la phase de placement)


**'dTirer'** : Début de la phase de jeu (se tirer dessus)


**'badAim'** : Message d'erreur, ne peut pas tirer sur la cible (hors map, endroit déjà touché)


**'fTour'** : Fin du tour, donne les informations sur le tour aux joueurs
**(data)** : {val: true|false,x: #,y: #} Si le tire a touché l'adversaire val = true, sinon false, x,y la position attaqué


**'tour'** : C'est (pas) ton tour !
**(data)** : true|false, true = tour de ce joueur, false = pas son tour


**'fGame'** : Fin de la Game
**(data)** : true|false, true = t'as gagné (arrive aussi si l'adversaire quitte la partie), false = t'as perdu


**'plateau'** : Update du plateau lorsque tu places tes navires
**(plat)** : plat.plateau[i], avec i les lignes du plateau, et plat.plateau[i][j] les cases du plateau 



### socket.emit - Les messages envoyés au serveur



**'newGame'** : Créer une nouvelle instance de jeu


**'joinGame'** : Rejoindre une instance
**(#instance)** : Le numéro de l'instance que l'on veut rejoindre


**'place'** : Placer un navire sur le plateau
**(pos)** : {x1: ,y1: ,x2: , y2: } Les navires doivent faire 1 de largeur et une longeur de taille max celle du plateau, ne doit pas dépasser le 'nombre de navire' maximum plaçable sur le plateau, en gros {0, 0, 0, 5} valide mais {0, 0, 1, 1} non valide


**'tirer'** : Tirer sur une case
**(pos)** : {x: ,y: } La case sur laquelle tu tires


**'chat message'** : Parce que pourquoi pas !
**(msg)** : Le message envoyé dans l'instance
