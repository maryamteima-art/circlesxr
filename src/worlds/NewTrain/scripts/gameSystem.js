//Bridges actions obtained from controllerSystem.js (raw inputs to INCREMENT, DECRMENT, GRAB, and SELECT actions/keywords) with artifacts unique methods for each action (grab(), increment(), decrement(), select(). 
//I.e for clock increment() moves handles clockwise, and decrement() counterclockwise. I.e For suitcase increment() moves lock-digits up and decrement moves lock-digits down. I.e grab() for grabbables like thread inputs artifact's Id to player's inventory[] array and triggers "thread" boolean/flag. I.e grab() for coupon inputs couponId to player's inventory[] array and triggers "coupon" flag/boolean 

import { ArtifactSystem } from './artifactSystem.js';
import { ControllerSystem } from './controllerSystem.js';
import { UISystem } from './uiSystem.js';


export class GameSystem {
    constructor() {
        //Initialize Systems
        //Pass GameSystem instance to ArtifactSystem (for back reference)
        this.artifactSystem = new ArtifactSystem(this);
        //Pass GameSystem instance (for back-reference)
        this.controllerSystem = new ControllerSystem(this);
        //Pass GameSystem instance (for back-reference)
        this.uiSystem = new UISystem(this);
        console.log("GameSystem initialized");
        //Timer and game state
        //Example: 300 seconds (5 minutes)
        this.gameTime = 300; 
        this.gameOver = false;
        this.win = false;
    }
    //Initial game setup
    initialize() {
        //LOAD FIRST THEN DETECT INPUTS, otherwise it gives error since there's nothing to detect
        //Initialize and load artifacts 
        this.artifactSystem.loadArtifacts();
        //Setup device detection
        this.controllerSystem.handleInput();
        console.log("Game initialized and ready");
        //Setup cutscene
        //this.uiSystem.initializeCutscenes();
        //this.startTimer();
    }

    //Maps "click, keys, swipes" actions to artifact methods
    handleInputAction(action) {
        console.log(`Action received: ${action}`);
    
        // Obtain player's position
        const playerPos = this.playerPosition();
        
        //Attempt to find an artifact in proximity based on the player's position
        const artifactDetected = this.artifactSystem.findArtifactInProximity(playerPos);
        
        //Check if an artifact was found
        if (artifactDetected){ //&& artifactDetected.canInteract()) {
            console.log("Artifact in proximity for interaction:", artifactDetected);
            // Call handleArtifactAction with the found artifact and the action
            this.artifactSystem.handleArtifactAction(artifactDetected, action);
        } else {
            console.log("No artifact in proximity for interaction.");
        }

    }
    
    //Game's player tracking via camera location (object.getWorldPosition)
    playerPosition() {
        //obtain camera (which is player)
        // Use CirclesXR's method to get the main camera element (which is also the player's location)
        const playerEntity = CIRCLES.getMainCameraElement();
        //return position vector
        return playerEntity.object3D.getWorldPosition(new THREE.Vector3());
    }

    //Checks if artifact is interactable with 
    //Sewing Machine is initially locked until Needle+Thread and fabric is collected (fabric collected from floor, and Needle+Thread only collected when suitcase is unlocked), and player is in proximity
    //Clock is initially locked until handles have been collected (only happens if suitcase is unlocked)
    //Suitcase gives two items to inventory (Needle+Thread and Handles)
    canInteractWithArtifact(artifactType) {
        // Assuming a method that checks the inventory for a specific item
        // For clocks, ensure the specific grabbable item is in the inventory
        if (artifactType === 'clock') {
            return this.playerInventory.includes('handles');
        }
        // Default to true for other artifacts or specify other conditions as needed
        return true;
    }
    
    startTimer() {
        //300 seconds for 5min
        this.gameTime = 300; 
        this.timerInterval = setInterval(() => {
            this.gameTime--;
            console.log("Time left:", this.gameTime);
            
            // Update the timer display through UISystem
            this.uiSystem.updateTimerDisplay(this.gameTime);

            if (this.gameTime <= 0) {
                clearInterval(this.timerInterval); 
                //Only check if the game hasn't already been won
                if (!this.win) { 
                    this.checkWinCondition(); 
                }
            }
            //Update every second
        }, 1000); 
    }
    //Win state
    checkWinCondition() {
        //If the player has the necklace and time is above 0, they win
        if (this.artifactSystem.playerInventory['necklace'] && this.gameTime > 0) {
            console.log("Congratulations! You have won the game.");
            this.win = true;
            this.uiSystem.showWinOverlay();
        } else {
            console.log("Game Over. You didn't find the necklace in time");
            this.win = false;
            this.uiSystem.showGameOverOverlay();
        }
        //Mark game as over
        this.gameOver = true;
        // Proceed to handle the end of the game
        this.endGame();
    }
    
}
