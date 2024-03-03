//Bridges actions obtained from controllerSetup.js (raw inputs to INCREMENT, DECRMENT, GRAB, and SELECT actions/keywords) with artifacts unique methods for each action (grab(), increment(), decrement(), select(). 
//I.e for clock increment() moves handles clockwise, and decrement() counterclockwise. I.e For suitcase increment() moves lock-digits up and decrement moves lock-digits down. I.e grab() for grabbables like thread inputs artifact's Id to player's inventory[] array and triggers "thread" boolean/flag. I.e grab() for coupon inputs couponId to player's inventory[] array and triggers "coupon" flag/boolean 

import { ArtifactSystem } from './artifactSystem.js';
import { ControllerSystem } from './controllerSystem.js';
import { MultiplayerModule } from './multiplayerModule.js';

export class GameSystem {
    constructor() {
        //this.artifactSystem = new ArtifactSystem();
        // Pass GameSystem instance (for back-reference)
        this.controllerSystem = new ControllerSystem(this);
        //this.multiplayerModule = new MultiplayerModule();
        console.log("GameSystem initialized");
    }
    //Initial game setup
    initialize() {
        // Setup device detection
        this.controllerSetup.handleInput();
        
        // Initialize and load artifacts
        this.artifactSystem = new ArtifactSystem();
        this.artifactSystem.loadArtifacts();
        
        console.log("Game initialized and ready");
    }

    //Maps "click, keys, swipes" actions to artifact methods
    handleInputAction(action) {
        console.log(`Action received: ${action}`);
        
        //**********EDIT LATER************/
        console.log(`Action received: ${action}`);
        const playerPos = this.playerPosition();
        //returns the object in proximity
        const artifactDetected = this.artifactSystem.findArtifactInProximity(playerPos);
        //If object's returned
        if (artifactDetected) {
            //Perform its increment, decrement or grab methods depending on player input
            this.artifactSystem.handleArtifactAction(artifact, action);
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

    update(deltaTime) {
        // Main game loop update method
        //For updating game state, handling player actions, etc.
    }

    // This function manages updates to player progress, such as levels, scores, or achievements
    handlePlayerProgress() {
        // Implementation for updating player progress
    }

    //Game start, game over conditions, or level transitions

    // Additional methods as necessary for your game's functionality
}