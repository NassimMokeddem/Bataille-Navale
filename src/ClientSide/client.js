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
        // alert(msg);
    })
    socket.on('Fin De partie', (msg) =>{
        alert(msg);

        
    })
    function buyBoat(){
        socket.emit('placeNavire', {type: document.getElementById("boat-type").value, x: Number(document.getElementById("x").value), y: Number(document.getElementById("y").value)});
    }

    /*
    * On attend bien des chaînes de caractère pour l'identifiant de la partie
    */
    function createGame(){
        socket.emit('newGame', String(document.getElementById("roomID").value));
        console.log('toto')
        joueur = 1
    }

    function joinGame(){
        socket.emit('joinGame', String(document.getElementById("roomID").value));
        joueur = 2
    }

    function shootBoat() {
        const xAtk = Number(document.getElementById("xAtk").value);
        const yAtk = Number(document.getElementById("yAtk").value);
        const xDef = Number(document.getElementById("xDef").value);
        const yDef = Number(document.getElementById("yDef").value);

        // Emit the event to the server
        socket.emit('navireAttaque', { xAttaquant: xAtk, yAttaquant: yAtk, xDefenseur: xDef, yDefenseur: yDef });

        // Get the dimensions of the game board and cells
        const cellSize = gameBoard.querySelector('.cell').offsetWidth;

        // Calculate positions
        const startX = xAtk * cellSize + cellSize / 2; // Center of attacker cell
        const startY = yAtk * cellSize + cellSize / 2;
        const endX = xDef * cellSize + cellSize / 2; // Center of defender cell
        const endY = yDef * cellSize + cellSize / 2;

        // Create the missile element
        const missile = document.createElement("div");
        missile.className = "missile";
        missile.style.left = `${startX}px`;
        missile.style.top = `${startY}px`;
        missile.style.setProperty('--target-x', `${endX - startX}px`);
        missile.style.setProperty('--target-y', `${endY - startY}px`);

        // Append the missile to the game board
        gameBoard.appendChild(missile);

        // Remove the missile after animation ends
        missile.addEventListener("animationend", () => {
            missile.remove();
        });
    }


    function moveBoat(){
        socket.emit('navireDeplace', {xNavire: Number(document.getElementById("xDep").value), yNavire: Number(document.getElementById("yDep").value), xDeplacement: Number(document.getElementById("xArr").value), yDeplacement: Number(document.getElementById("yArr").value)})
    }

    function endTurn(){
        socket.emit('finDeTour');
    }

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
                            argentContainer.innerHTML = `<div class="argent-display">💰 ${cell.contenu.argent}</div>`
                        }

                        if(joueur === 2 && (rowIndex ===  game.grille.length - 1 && colIndex === row.length - 1)){
                            argentContainer.innerHTML = `<div class="argent-display">💰 ${cell.contenu.argent}</div>`
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
                <h3>Boat Information at (${row}, ${col})</h3>
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
                document.getElementById("xDep").value = row
                document.getElementById("yDep").value = col
                document.getElementById("xAtk").value = row
                document.getElementById("yAtk").value = col
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

//Détéction des clicks hors d'éléments pour cacher des interfaces
document.addEventListener('click', function(event) {
    console.log(event.target)

    console.log("is in buy-boat ? " + inBuyBoat(event.target))

    if(!isAboatCell(event.target)) {
        document.getElementById('cell-state').classList.remove('active')
        document.getElementById("move-boat").style.display='none'
        document.getElementById("shoot-boat").style.display='none'
    }

    // hide the buy boat if not clicked on a base
    if(!inBuyBoat(event.target) && !isAbaseCell(event.target))
        document.getElementById('buy-boat').style.display = 'none'
});

function isAbaseCell(target){
    if(target.childNodes.length === 0)
        return false
    else{
        if(target.childNodes[0].alt !== 'Base')
            return false
        else
            return true
    }
}

function isAboatCell(target){
    if(target.childNodes.length === 0)
        return false
    else{
        if(target.childNodes[0].alt !== 'Boat')
            return false
        else
            return true
    }
}

function isEmptyCell(target){
    if(target.classList.contains('cell') && target.childNodes.length === 0)
        return true
    return false
}

function inBuyBoat(target){
    if(target.id === 'buy-boat' || target.parentElement.id === 'buy-boat')
        return true
    return false
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
    document.querySelector('[onclick="createGame()"]').addEventListener('click', () => {
        createGame(); // Call your existing createGame function
        showGameScreen(); // Transition to game screen
    });

    document.querySelector('[onclick="joinGame()"]').addEventListener('click', () => {
        joinGame(); // Call your existing joinGame function
        showGameScreen(); // Transition to game screen
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
