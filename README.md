# Jeu de Stratégie Navale

## Description

Ce projet est un jeu de stratégie navale combinant des éléments de la bataille navale avec des mécaniques de gestion et de développement stratégiques. Les joueurs placent et manœuvrent des navires, gèrent des bases navales, et cherchent à contrôler un plateau pour surpasser leurs adversaires. Le jeu est multijoueur et permet aux utilisateurs de se connecter et de jouer en ligne.

## Fonctionnalités principales

- **Contrôleur réseau** : Un `Controller` établit une connexion par socket en accédant à l'URL `http://adresse_serveur/partie/start/`.
- **Modèles du jeu** :
  - `Navire.js` : représente les différents navires.
  - `BaseNavale.js` : gère les bases navales des joueurs.
  - `Case.js` : modélise chaque case du plateau.
  - `Plateau.js` : décrit le plateau de jeu où les actions se déroulent.
- **Service de logique métier** : La classe `Service` centralise la logique du jeu et gère les actions métiers, notamment les déplacements, les interactions, et les batailles.

## Prérequis

Avant de commencer, assurez-vous que les éléments suivants sont installés sur votre machine :

- **Node.js** (v12.0 ou supérieur)
- **npm** (v6.0 ou supérieur)

## Installation

1. Clonez ce dépôt :
   ```bash
   git clone <URL_du_dépôt>
   cd nom_du_dossier
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

## Démarrage

Pour lancer le serveur de jeu, exécutez la commande suivante :

```bash
node server.js
```

Une fois le serveur lancé, les joueurs peuvent rejoindre la partie en accédant à l'URL suivante dans leur navigateur :

```plaintext
http://adresse_serveur/partie/start/
```
Une partie a démarré une fois que les 2 joueurs ont rejoins un salon. Pour créer et rejoindre un salon utilisez les boutons "Create Game" et "Join Game".

## Technologies utilisées

- **Express** : pour la création et la gestion du serveur web.
- **Morgan** : pour le logging des requêtes HTTP.
- **Socket.io** : pour la gestion de la communication en temps réel entre les joueurs.

## Structure des Dossiers

- `models/` : contient les modèles de jeu (`Navire.js`, `BaseNavale.js`, `Case.js`, `Plateau.js`) définissant les classes principales.
- `controllers/` : contient le contrôleur responsable de la gestion des sockets et du flux de jeu.
- `services/` : inclut le fichier `Service.js` qui centralise la logique métier du jeu.

## Contribuer

Les contributions sont les bienvenues ! Pour proposer une amélioration ou corriger un bug, créez une *issue* ou ouvrez une *pull request*. Merci de consulter le guide de contribution avant de soumettre vos modifications.

## Licence

Ce projet est distribué sous la licence **GNU GPL v3**.  
Vous êtes libre de l'utiliser, le modifier et le distribuer dans les conditions prévues par la licence GPL.

Pour plus d’informations, veuillez consulter le fichier [LICENSE](LICENSE) ou [la documentation de la licence GPL v3](https://www.gnu.org/licenses/gpl-3.0.fr.html).
