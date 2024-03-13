//Bridges actions obtained from controllerSystem.js (raw inputs to INCREMENT, DECRMENT, GRAB, and SELECT actions/keywords) with artifacts unique methods for each action (grab(), increment(), decrement(), select(). 
//I.e for clock increment() moves handles clockwise, and decrement() counterclockwise. I.e For suitcase increment() moves lock-digits up and decrement moves lock-digits down. I.e grab() for grabbables like thread inputs artifact's Id to player's inventory[] array and triggers "thread" boolean/flag. I.e grab() for coupon inputs couponId to player's inventory[] array and triggers "coupon" flag/boolean 

import { ArtifactSystem } from './artifactSystem.js';
import { ControllerSystem } from './controllerSystem.js';
import { MultiplayerModule } from './multiplayerModule.js';

//const eventEmitter = new EventEmitter();


export class GameSystem {
    constructor() {
        //Initialize Systems
        this.artifactSystem = new ArtifactSystem();
        // Pass GameSystem instance (for back-reference)
        this.controllerSystem = new ControllerSystem(this);
        console.log("GameSystem initialized");
    }
    //Initial game setup
    initialize() {
        //LOAD FIRST THEN DETECT INPUTS, otherwise it gives error since there's nothing to detect
        // Initialize and load artifacts 
        this.artifactSystem.loadArtifacts();
        // Setup device detection
        this.controllerSystem.handleInput();
        console.log("Game initialized and ready");
    }

    //Maps "click, keys, swipes" actions to artifact methods
    handleInputAction(action) {
        console.log(`Action received: ${action}`);
    
        // Obtain player's position
        const playerPos = this.playerPosition();
        
        // Attempt to find an artifact in proximity based on the player's position
        const artifactDetected = this.artifactSystem.findArtifactInProximity(playerPos);
        
        // Check if an artifact was found
        if (artifactDetected) {
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