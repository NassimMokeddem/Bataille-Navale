const socket = io();

    const gameBoard = document.getElementById('game-board');
    const argentContainer = document.getElementById('argent-container');

    var joueur;

    var bigGame;


    socket.on('game created', (game) => {
        // Initialize the game board based on the fetched state
        gameBoard.innerHTML = ''; // Clear any existing board
        document.getElementById('end-turn').style.display = 'block'

        updatePlateau(game)
        
    });


    socket.on('boatAcquired', (game) => {
        updatePlateau(game)
    })

    socket.on('navireEndommage', (game) => {
        const xAtk = Number(document.getElementById("xAtk").value);
        const yAtk = Number(document.getElementById("yAtk").value);
        const xDef = Number(document.getElementById("xDef").value);
        const yDef = Number(document.getElementById("yDef").value);

        // Get the dimensions of the game board and cells
        const cellSize = gameBoard.querySelector('.cell').offsetWidth;
    
        // Get the game board's position relative to the viewport
        const boardRect = gameBoard.getBoundingClientRect();
    
        // Calculate the starting position of the missile
        const startX = boardRect.left + xAtk * cellSize; // Center of attacker cell
        const startY = boardRect.top + yAtk * cellSize;
    
        // Calculate the ending position of the missile
        const endX = boardRect.left + xDef * cellSize; // Center of defender cell
        const endY = boardRect.top + yDef * cellSize;
    
        // Create the missile element
        const missile = document.createElement("div");
        missile.className = "missile";
        missile.style.left = `${startX}px`;
        missile.style.top = `${startY}px`;
        missile.style.setProperty('--target-x', `${endX - startX}px`);
        missile.style.setProperty('--target-y', `${endY - startY}px`);
    
        // Append the missile to the document body
        document.body.appendChild(missile);
    
        missile.addEventListener("animationend", () => {
            missile.remove();
        
            // Create explosion at defender's position
            const explosion = document.createElement("div");
            explosion.className = "explosion";
            explosion.style.left = `${endX - 15}px`; // Adjust to center the explosion
            explosion.style.top = `${endY - 15}px`;
        
            gameBoard.appendChild(explosion);
        
            // Remove the explosion after the animation
            explosion.addEventListener("animationend", () => {
                explosion.remove();
            });
        });

        updatePlateau(game)
    })

    socket.on('navireArrive', (game) => {
        updatePlateau(game)
    })

    socket.on('Tour', (msg) => {
        const preElement = document.getElementById('turn-state');
        preElement.innerHTML = JSON.stringify(msg, null, 2);
    })

    socket.on('TourD', (game) => {
        updatePlateau(game)
    })

    socket.on('ERROR', (msg) =>{
        if(msg === 'partie pleine' && joueur === 2){
        }
        else if(!erreurPartiePleineAffichee){
            alert(msg)
        }
        if(joueur !== 2 && joueur !== 1)
            erreurPartiePleineAffichee = true
    })
    socket.on('Fin De partie', (msg) =>{
        alert(msg);

        
    })
    function buyBoat() {
        const selectedBoatType = document.querySelector('input[name="boat-type"]:checked')?.value;
        if (!selectedBoatType) {
            alert("Please select a boat type.");
            return;
        }
        const x = Number(document.getElementById("x").value);
        const y = Number(document.getElementById("y").value);
    
        if (isNaN(x) || isNaN(y)) {
            alert("Please provide valid X and Y coordinates.");
            return;
        }
    
        socket.emit('placeNavire', { type: selectedBoatType, x, y });
    }
    

    /*
    * On attend bien des chaînes de caractère pour l'identifiant de la partie
    */
    let erreurPartiePleineAffichee = false;

    function createGame(){
        erreurPartiePleineAffichee = false
        return new Promise((resolve, reject) => {
            const roomID = document.getElementById('roomID').value;
            if (!roomID || isNaN(roomID) || parseInt(roomID) <= 0) {
                alert("Entrez un nombre svp");
                reject(0)
                return
            }
            socket.emit('newGame', String(roomID));
            socket.on('OKK', (msg) => {
                if (msg === 'j1go') {
                    joueur = 1
                    resolve(1)
                } else {
                    console.log(msg)
                    reject(0)
                }
            })
            //console.log('toto')
        })
    }

    function joinGame() {
        erreurPartiePleineAffichee = false
        return new Promise((resolve, reject) => {
            const roomID = document.getElementById('roomID').value
    
            if (!roomID || isNaN(roomID) || parseInt(roomID) <= 0) {
                alert("Entrez un nombre svp")
                reject(0)
                return
            }
    
            socket.emit('joinGame', String(roomID))
    
            socket.on('OK', (msg) => {
                if (msg === 'go') {
                    joueur = 2
                    resolve(1)
                } else {
                    console.log(msg)
                    reject(0)
                }
            })
        })
    }

    function shootBoat() {
        // Emit the event to the server
        socket.emit('navireAttaque', { 
             xAttaquant: Number(document.getElementById("xAtk").value),
             yAttaquant: Number(document.getElementById("yAtk").value),
             xDefenseur: Number(document.getElementById("xDef").value),
             yDefenseur: Number(document.getElementById("yDef").value)
            });
        
    }
    


    function moveBoat(){
        socket.emit('navireDeplace', {xNavire: Number(document.getElementById("xDep").value), yNavire: Number(document.getElementById("yDep").value), xDeplacement: Number(document.getElementById("xArr").value), yDeplacement: Number(document.getElementById("yArr").value)})
    }

    function endTurn(){
        socket.emit('finDeTour');
    }


    // ATTENTION row sont les y et col sont les x
    function updatePlateau(game){
        // Initialize the game board based on the fetched state
        gameBoard.innerHTML = '';

        // Iterate over each row in the grid
        game.grille.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const cellDiv = document.createElement('div');
                cellDiv.className = 'cell';
                cellDiv.dataset.row = rowIndex;
                cellDiv.dataset.col = colIndex;

                if( cell.contenu !== null ){
                    if('argent' in cell.contenu){
                        const baseIcon = document.createElement('img');
                        baseIcon.src = 'icons/base.png'; // Replace with the correct path to your boat icon
                        baseIcon.alt = 'Base';
                        baseIcon.className = 'icon';
                        cellDiv.appendChild(baseIcon);

                        if(joueur === 1 && (rowIndex === 0 && colIndex === 0)){
                            argentContainer.innerHTML = `<div class="argent-display">JOUEUR 1</div>
                            <div class="argent-display">💰 ${cell.contenu.argent}</div>`
                        }

                        if(joueur === 2 && (rowIndex ===  game.grille.length - 1 && colIndex === row.length - 1)){
                            argentContainer.innerHTML = `<div class="argent-display">JOUEUR 2</div>
                            <div class="argent-display">💰 ${cell.contenu.argent}</div>`
                        }
                    }
                    else if('type' in cell.contenu){
                        const boatIcon = document.createElement('img');
                        switch(cell.contenu.type) {
                            case 'Destroyer':
                                boatIcon.src = 'icons/destroyer.png';
                                break;
                            case 'SousMarin':
                                boatIcon.src = 'icons/sous-marin.png';
                                break;
                            case 'Fregate':
                                boatIcon.src = 'icons/fregate.png';
                                break;
                        }
                        boatIcon.alt = 'Boat';
                        boatIcon.className = 'icon';
                        cellDiv.appendChild(boatIcon);
                    }
                    else
                        console.log('unknown class of object' + cell)
                }
                //console.log(cell.contenu.degat)

                // Add click event to send the player's move
                cellDiv.addEventListener('click', () => {
                    const row = parseInt(cellDiv.dataset.row, 10);
                    const col = parseInt(cellDiv.dataset.col, 10);
                    displayCellState(row, col); // Function to display the state of the clicked cell
                });
                
                gameBoard.appendChild(cellDiv);
            });
        });
        
        bigGame = game;
    }
    
    function displayCellState(row, col) {
        const cell = bigGame.grille[row][col];
        const stateElement = document.getElementById('cell-state'); // Element to display the state
        
        if (cell.contenu !== null) {
            if ('type' in cell.contenu) {
                // If it's a boat, show all boat properties
                const boatInfo = cell.contenu; // The Navire object
                
                stateElement.innerHTML = `
                <h3>Boat Information at (${col}, ${row})</h3>
                <p><strong>Type:</strong> ${boatInfo.type}</p>
                <p><strong>Health:</strong> ${boatInfo.sante} / ${boatInfo.santeMax}</p>
                <p><strong>Damage:</strong> ${boatInfo.degat}</p>
                <p><strong>Armor:</strong> ${boatInfo.armure}</p>
                <p><strong>Movement Points:</strong> ${boatInfo.pm}</p>
                <p><strong>Action Points:</strong> ${boatInfo.pa}</p>
                <p><strong>Range:</strong> ${boatInfo.portee}</p>
                <p><strong>Crew:</strong> ${boatInfo.equipage} / ${boatInfo.maxEquipage}</p>
                <p><strong>Food:</strong> ${boatInfo.nourriture} / ${boatInfo.maxNourriture}</p>
                <p><strong>Dimensions:</strong> ${boatInfo.dimension[0]} x ${boatInfo.dimension[1]}</p>
                <p><strong>Status:</strong> ${boatInfo.inutilisable ? 'Disabled' : 'Active'}</p>
                `;
                stateElement.classList.add('active');
                document.getElementById("move-boat").style.display='block'
                document.getElementById("shoot-boat").style.display='block'
                document.getElementById("xDep").value = col
                document.getElementById("yDep").value = row
                document.getElementById("xAtk").value = col
                document.getElementById("yAtk").value = row
        }
        else if ('argent' in cell.contenu){
            //if ((row >= 0 && row <= 1) && (col >= 0 && col <= 1) && joueur === 1) {  // Replace with the condition for your base locations
                // Show the buy-boat div and set the coordinates
                document.getElementById('buy-boat').style.display = 'block';
                document.getElementById('buy-boat').style.setProperty("display", "block");
            //}
        }
    } else {
        // If the cell is empty
        stateElement.innerHTML = `Cell at (${row}, ${col}) is empty.`;
        stateElement.classList.add('active');
    }
}

// Détéction des clicks hors d'éléments pour cacher des interfaces
// Detect clicks outside menus to hide interfaces
document.addEventListener('click', function (event) {
    const buyBoatElement = document.getElementById('buy-boat');
    const cellStateElement = document.getElementById('cell-state');
    const moveBoatElement = document.getElementById('move-boat');
    const shootBoatElement = document.getElementById('shoot-boat');

    // Check if the click is inside #buy-boat or #cell-state
    const isInsideBuyBoat = buyBoatElement.contains(event.target);
    const isInsideCellState = cellStateElement.contains(event.target);
    const isInsideMoveBoat = moveBoatElement.contains(event.target);
    const isInsideShootBoat = shootBoatElement.contains(event.target);

    console.log("is inside buy-boat?", isInsideBuyBoat);
    console.log("is inside cell-state?", isInsideCellState);
    console.log("is inside move-boat?", isInsideMoveBoat);
    console.log("is inside shoot-boat?", isInsideShootBoat);

    // Hide cell state and related UI if the click is outside a boat cell and not inside cell-state
    if (!isAboatCell(event.target) && !isInsideCellState && !isInsideMoveBoat && !isInsideShootBoat) {
        cellStateElement.classList.remove('active');
        document.getElementById("move-boat").style.display = 'none';
        document.getElementById("shoot-boat").style.display = 'none';
    }

    // Hide the buy-boat menu if the click is outside buy-boat and base cells
    if (!isInsideBuyBoat && !isAbaseCell(event.target)) {
        buyBoatElement.style.display = 'none';
    }
});

// Check if the target is a base cell
function isAbaseCell(target) {
    if (target.childNodes.length === 0) {
        return false;
    } else {
        return target.childNodes[0].alt === 'Base';
    }
}

// Check if the target is a boat cell
function isAboatCell(target) {
    if (target.childNodes.length === 0) {
        return false;
    } else {
        return target.childNodes[0].alt === 'Boat';
    }
}

// Check if the target is an empty cell
function isEmptyCell(target) {
    return target.classList.contains('cell') && target.childNodes.length === 0;
}

// Check if the target is inside the buy-boat menu
function inBuyBoat(target) {
    const buyBoatElement = document.getElementById('buy-boat');
    return buyBoatElement.contains(target);
}



document.addEventListener('DOMContentLoaded', () => {
    const homeScreen = document.getElementById('home-screen');
    const gameContainer = document.getElementById('game-container');

    function showHomeScreen() {
        homeScreen.style.display = 'flex';
        gameContainer.style.display = 'none';
    }

    function showGameScreen() {
        homeScreen.style.display = 'none';
        gameContainer.style.display = 'block';
    }

    // Attach event handlers to the buttons
     document.getElementById('createGameButton').addEventListener('click', () => {
        // if(createGame()) // Call your existing createGame function
        //     showGameScreen() // Transition to game screen
        createGame().then((result) => {
            showGameScreen()
        })
        .catch((error) => {
            console.log('Failed to create game:', error)
        });
    });

    document.getElementById('joinGameButton').addEventListener('click', () => {
        joinGame().then((result) => {
            showGameScreen()
        })
        .catch((error) => {
            console.log('Failed to join game:', error)
        });
    });

    // Initialize by showing the home screen
    showHomeScreen();
});

document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-button');
    const startContent = document.getElementById('start-content');
    const menuContent = document.getElementById('menu-content');

    // Event listener for the START button
    startButton.addEventListener('click', () => {
        startContent.style.display = 'none'; // Hide the START button
        menuContent.style.display = 'block'; // Show the Room ID menu
    });
});


document.addEventListener('DOMContentLoaded', () => {
    updateBoatDetails();
});

function updateBoatDetails() {
    const selectedBoatType = document.querySelector('input[name="boat-type"]:checked')?.value;
    const boatPriceElement = document.getElementById("boat-price");
    const boatImageElement = document.getElementById("boat-image");

    if (!selectedBoatType) {
        boatPriceElement.textContent = "";
        boatImageElement.style.display = "none";
        return;
    }

    // Set price and image based on the selected boat type
    let boatDetails = {
        Destroyer: { price: 20, image: "icons/destroyer.png" },
        SousMarin: { price: 60, image: "icons/sous-marin.png" },
        Fregate: { price: 35, image: "icons/fregate.png" },
    };

    const { price, image } = boatDetails[selectedBoatType];
    boatPriceElement.textContent = `Price: 💰 ${price}`;
    boatImageElement.src = image;
    boatImageElement.style.display = "block";
}


// Ajouter la gestion de la musique
document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("start-button");
    const gameMusic = document.getElementById("game-music");

    if (startButton && gameMusic) {
        startButton.addEventListener("click", () => {
            gameMusic.play();
            gameMusic.loop = true; // La musique se répète en boucle

            // // Arrêter la musique après 30 secondes
            // setTimeout(() => {
            //     gameMusic.pause();
            //     gameMusic.currentTime = 0; // Remet à zéro la lecture
            // }, 30000); // 30 000 ms = 30 secondes
        });
    }
});
