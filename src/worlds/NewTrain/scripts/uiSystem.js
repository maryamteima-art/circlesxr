//Deals with Universal UI (notebook, game progress, timer)
export class UISystem {
    constructor(gameSystem) {
        this.gameSystem = gameSystem;
        //Reference to the A-Frame camera entity for attaching UI elements
        this.cameraEntity = CIRCLES.getMainCameraElement();
        
        //Index to track current cutscene
        this.currentCutsceneIndex = 0;
        // Array of cutscene image paths
        this.cutscenes = ['images/scene1.png', 'images/scene2.png', 'images/scene3.png', 'images/scene4.png'];
        // Total number of cutscenes available
        this.totalCutscenes = this.cutscenes.length;

        // Initialize buttons and image
        this.initializeCutsceneUI();
    }

    //Create and show the game over overlay
    showGameOverOverlay(elapsedTime) {
        //Buttons
        //const overlay = this.createPlaneWithoutTitle('images/lose.png');
        const overlay = this.createModelOverlay('#loseNecklace');
        const retryButton = this.createButtonWithText("Retry", "red", "blue");
        overlay.appendChild(retryButton);

        //Score 
        //Get player's score from gameSystem
        const scores = this.gameSystem.getScores();
        //Create a listed leaderboards tier and place into a text entity
        const scoresText = this.createScoresText(scores, elapsedTime);
        overlay.appendChild(scoresText);
        //Attach overlay (A-image, button + Score text) to camera
        this.cameraEntity.appendChild(overlay);
    }

    //Create and show the win overlay
    showWinOverlay(elapsedTime) {
        //Button
        //const overlay = this.createPlaneWithoutTitle('images/win.png');
        const overlay = this.createModelOverlay('#winNecklace');
        const playAgainButton = this.createButtonWithText("Play Again", "green", "blue");
        overlay.appendChild(playAgainButton);

        //Score
        //Get player's score from gameSystem
        const scores = this.gameSystem.getScores();
        //Create a listed leaderboards tier and place into a text entity
        const scoresText = this.createScoresText(scores, elapsedTime);
        overlay.appendChild(scoresText);

        //Attach overlay (A-image, button + Score text) to camera
        this.cameraEntity.appendChild(overlay);
    }

    //Generates a 3D model to acts as the backdrop in front of the leaderboard stats & replay buttons
    createModelOverlay(modelUrl) {
        const modelEntity = document.createElement('a-entity');
        modelEntity.setAttribute('gltf-model', modelUrl);
        //Scale
        modelEntity.setAttribute('scale', '1 1 1'); 
        //Position
        modelEntity.setAttribute('position', '0 0 -3');  
        //Rotation
        modelEntity.setAttribute('rotation', '0 0 0'); 
    
        this.cameraEntity.appendChild(modelEntity);
    
        return modelEntity;
    }

    //Generates a circlesXR button with Text-Title above it
    createButtonWithText(text, color, hoverColor) {
        //Parent Entity (combines button with text)
        const buttonGroup = document.createElement('a-entity');
        //Buttn Entity
        const button = document.createElement('a-entity');

        //CirclesXR button from inputs
        button.setAttribute('circles-button', `type: box; button_color: ${color}; button_color_hover: ${hoverColor}; pedestal_color: rgb(255, 255, 255); width: 1; height: 0.2; depth: 0.1`);
        button.setAttribute('position', '0 -0.65 0');
        button.setAttribute('rotation', '90 0 0');

        //When the button is clicked, call buttonAction with the button's text as the identifier
        button.addEventListener('click', () => this.buttonAction(text));

        //Append button to parent
        buttonGroup.appendChild(button);

        //Text
        const textEntity = document.createElement('a-text');
        textEntity.setAttribute('value', text);
        textEntity.setAttribute('color', '#FFFFFF');
        textEntity.setAttribute('align', 'center');
        textEntity.setAttribute('position', '0 -0.17 0.7');
        textEntity.setAttribute('width', 4);

        //Append Text to Parent
        buttonGroup.appendChild(textEntity);

        return buttonGroup;
    }

    //Creates a listed leaderboards tier and places it into a text entity
    createScoresText(scores, elapsedTime) {
        
        const scoresText = document.createElement('a-text');
        scoresText.setAttribute('position', '-1 2 0'); 
        scoresText.setAttribute('color', 'white');
        scoresText.setAttribute('width', 4);

        // Add player's current score at the top
        let displayText = `Your Score: ${elapsedTime} seconds\nLeaderboard:\n`;
        if (scores.length === 0) {
            //Placeholder if no scores (just dashes)
            displayText += "- - -\n"; 
        } else {
            scores.slice(0, 3).forEach((score, index) => {
                //Create 1., 2., 3. from indices (within new lines) and attach their repsective scores
                displayText += `${index + 1}. ${score} seconds\n`;
            });
        }

        scoresText.setAttribute('value', displayText);
        return scoresText;
    }

    //Button text is the identifier
    //Performs specific actions depending on button clicked
    buttonAction(actionIdentifier) {
        switch (actionIdentifier) {
            case 'Start Game':
                // Start game logic
                console.log('Starting game...');
                // Start the timer and game
                this.gameSystem.startTimer();
                break;
            case 'Next':
                // Logic for next cutscene
                console.log('Next cutscene...');
                this.showNextCutscene();
                break;
            case 'Prev':
                // Logic for previous cutscene
                console.log('Previous cutscene...');
                this.showPrevCutscene();
                break;
            case 'Retry':
                // Reload the game
                location.reload();
                break;
            case 'Play Again':
                // Reload the game
                location.reload();
                break;
            case 'Start Game':
                console.log('Starting game...');
                this.startGame();
                break;
            case 'Next':
                this.showNextCutscene();
                break;
            case 'Prev':
                this.showPrevCutscene();
                break;
            default:
                console.log('No action defined for this button.');
                break;
        }
    }

    initializeCutsceneUI() {
        //Locate the image entity
        this.cutsceneImage = document.getElementById('cutsceneImage');
        //Locate scene
        const scene = document.querySelector('a-scene');

        //Initialize buttons with click listeners
        const prevButton = document.createElement('a-entity');
        prevButton.setAttribute('circles-button', `type: cylinder; button_color: rgb(255,0,0); button_color_hover: rgb(255,180,180); pedestal_color: rgb(255,255,0); diameter: 0.1`);
        //Shortening buttons (they were too tall by default)
        prevButton.setAttribute('scale', "4 10 4");
        prevButton.setAttribute('rotation', `90 0 0`);
        prevButton.setAttribute('position', "-2.540 2.645 17.344"); 
        //IF CLICK
        prevButton.addEventListener('click', () => {
            this.showPrevCutscene();
        });

        //Initialize buttons with click listeners
        const nextButton = document.createElement('a-entity');
        nextButton.setAttribute('circles-button', `type: cylinder; button_color: rgb(0,255,0); button_color_hover: rgb(255,180,180); pedestal_color: rgb(255,255,0); diameter: 0.1`);
        //Shortening buttons (they were too tall by default)
        nextButton.setAttribute('scale', "4 10 4");
        nextButton.setAttribute('rotation', `90 0 0`);
        nextButton.setAttribute('position', "-2.540 1.5 17.344"); 
        //IF CLICK
        nextButton.addEventListener('click', () => {
            this.showNextCutscene();
        });

        scene.appendChild(nextButton);
        scene.appendChild(prevButton);
        
    }

    showNextCutscene() {
        // Increment index and wrap around using modulo
        this.currentCutsceneIndex = (this.currentCutsceneIndex + 1) % this.totalCutscenes;
        this.updateCutsceneImage();
    }

    showPrevCutscene() {
        // Decrement index and wrap around if it goes below 0
        if (this.currentCutsceneIndex === 0) {
            this.currentCutsceneIndex = this.totalCutscenes - 1;
        } else {
            this.currentCutsceneIndex -= 1;
        }
        this.updateCutsceneImage();
    }

    updateCutsceneImage() {
        // Update the source of the cutscene image
        this.cutsceneImage.setAttribute('src', this.cutscenes[this.currentCutsceneIndex]);
    }


    //Showcases Timer
    // This method updates or creates a timer text entity in the scene
    updateTimerDisplay(timeLeft) {
        const cameraEntity = CIRCLES.getMainCameraElement();
        let timerTextEntity = document.getElementById('timer-text-entity');

        //If none exists create one
        if (!timerTextEntity) {
            timerTextEntity = document.createElement('a-text');
            timerTextEntity.setAttribute('id', 'timer-text-entity');
            timerTextEntity.setAttribute('position', '1 -0.9 -2'); 
            timerTextEntity.setAttribute('align', 'center');
            cameraEntity.appendChild(timerTextEntity);
        }

        //Format time as needed, e.g., minutes:seconds
        //Divide total by 60 to get minutes
        const minutes = Math.floor(timeLeft/60);
        //modulo for seconds
        const seconds = timeLeft % 60;
        const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        timerTextEntity.setAttribute('value', `Timer: ${formattedTime}`);
    }

}