//Deals with Universal UI (notebook, game progress, timer)
export class UISystem {
    constructor(gameSystem) {
        this.gameSystem = gameSystem;
        //Reference to the A-Frame camera entity for attaching UI elements
        this.cameraEntity = CIRCLES.getMainCameraElement();
        
        //Cutscenes Array
        //Placeholder planes will be used if no gltf model is provided
        this.cutscenes = [
            {gltfModelUrl: null, placeholderColor: 'red' },
            {gltfModelUrl: null, placeholderColor: 'green' },
            //If no GLTF model, use null and specify a placeholder color
            {gltfModelUrl: null, placeholderColor: 'blue' }
        ];
        //Tracking the current cutscene being displayed (for next and prev buttons)
        this.currentCutsceneIndex = 0; 
    }

    initializeCutscenes() {
        // Show the first cutscene on game start
        this.showCutscene();
        //Add buttons
        const startGameButton = this.createButtonWithText("Start Game", "green", "lightgreen", () => this.buttonAction("Start Game"));
        this.cameraEntity.appendChild(startGameButton);
        
        const nextButton = this.createButtonWithText("Next", "green", "lightgreen", () => this.buttonAction("Next"));
        this.cameraEntity.appendChild(nextButton);
        
        const prevButton = this.createButtonWithText("Previous", "green", "lightgreen", () => this.buttonAction("Prev"));
        this.cameraEntity.appendChild(prevButton);
    }

    //Create and show the game over overlay
    showGameOverOverlay() {
        const overlay = this.createPlane('Game Over');
        const retryButton = this.createButtonWithText("Retry", "red", "blue");
        overlay.appendChild(retryButton);
        this.cameraEntity.appendChild(overlay);
    }

    //Create and show the win overlay
    showWinOverlay() {
        const overlay = this.createPlane('You Win!');
        const playAgainButton = this.createButtonWithText("Play Again", "green", "blue");
        overlay.appendChild(playAgainButton);
        this.cameraEntity.appendChild(overlay);
    }

    //Creates UI overlay
    //Null url by default
    createPlane(title, gltfModelUrl = null) {
        const planeEntity = document.createElement('a-entity');
    
        if (gltfModelUrl) {
            //Use the GLTF model if a URL is provided
            planeEntity.setAttribute('gltf-model', gltfModelUrl);
        } else {
            //Create placeholder plane geometry
            planeEntity.setAttribute('geometry', 'primitive: plane; width: 6; height: 4');
            //white
            planeEntity.setAttribute('material', 'color: #FFF'); 
            planeEntity.setAttribute('position', '0 0 -3');
            planeEntity.setAttribute('rotation', '0 0 0');
        }
    

        //Create a text entity for the title
        const titleText = document.createElement('a-text');
        titleText.setAttribute('value', title);
        //Black text color
        titleText.setAttribute('color', '#000'); 
        titleText.setAttribute('align', 'center');
        //Position the title above the plane
        titleText.setAttribute('position', '0 1.1 0.01'); 
        //Match the width of the plane
        titleText.setAttribute('width', 4); 

        //Append the title text to the plane entity
        planeEntity.appendChild(titleText);
    
        return planeEntity;
    }

    //Generates a circlesXR button with Text-Title above it
    createButtonWithText(text, color, hoverColor) {
        //Parent Entity (combines button with text)
        const buttonGroup = document.createElement('a-entity');
        //Buttn Entity
        const button = document.createElement('a-entity');

        //CirclesXR button from inputs
        button.setAttribute('circles-button', `type: box; button_color: ${color}; button_color_hover: ${hoverColor}; pedestal_color: rgb(255, 255, 255); width: 1; height: 0.2; depth: 0.1`);
        button.setAttribute('position', '0 -0.5 0');
        button.setAttribute('rotation', '90 0 0');

        //When the button is clicked, call buttonAction with the button's text as the identifier
        button.addEventListener('click', () => this.buttonAction(text));

        //Append button to parent
        buttonGroup.appendChild(button);

        //Text
        const textEntity = document.createElement('a-text');
        textEntity.setAttribute('value', text);
        textEntity.setAttribute('color', '#000');
        textEntity.setAttribute('align', 'center');
        textEntity.setAttribute('position', '0 -0.1 0.05');
        textEntity.setAttribute('width', 4);

        //Append Text to Parent
        buttonGroup.appendChild(textEntity);

        return buttonGroup;
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
            case 'Play Again':
                // Reload the game
                location.reload();
                break;
            default:
                console.log('No action defined for this button.');
                break;
        }
    }
    
    //Displays Current Cutscene
    //Imports either a gltf model if provided, or a placeholder plane
    showCutscene() {
        const cutscene = this.cutscenes[this.currentCutsceneIndex];
        const overlay = this.createPlane(cutscene.gltfModelUrl || cutscene.placeholderColor);
        this.cameraEntity.appendChild(overlay);
    }
    
    //Incrementing the current cutscene index with wrapping around (moves to first cutscene when reaching the end) 
    showNextCutscene() {
        this.currentCutsceneIndex = (this.currentCutsceneIndex + 1) % this.cutscenes.length;
        this.updateCutsceneDisplay();
    }
    
    //Decrementing the current cutscene index with wrapping around (moves to last cutscene when reaching the first)
    showPrevCutscene() {
        this.currentCutsceneIndex = (this.currentCutsceneIndex - 1 + this.cutscenes.length) % this.cutscenes.length;
        this.updateCutsceneDisplay();
    }
    
    //Clears previous gltf or plane, and loads the new one
    updateCutsceneDisplay() {
        //Clear existing cutscene UI
        //Each cutscene UI component is added directly to `this.cameraEntity`, hence removing child from camera
        while (this.cameraEntity.firstChild) {
            this.cameraEntity.removeChild(this.cameraEntity.firstChild);
        }
        
        //Show the new cutscene based on the current index
        this.showCutscene();
        
        //Optionally, update "Next" and "Prev" button states if needed
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
            timerTextEntity.setAttribute('position', '0 0.5 -2'); 
            timerTextEntity.setAttribute('align', 'center');
            cameraEntity.appendChild(timerTextEntity);
        }

        //Format time as needed, e.g., minutes:seconds
        //Divide total by 60 to get minutes
        const minutes = Math.floor(timeLeft/60);
        //modulo for seconds
        const seconds = timeLeft % 60;
        const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        timerTextEntity.setAttribute('value', `Time Left: ${formattedTime}`);
    }

}