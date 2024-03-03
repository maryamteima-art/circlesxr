//Bridges actions obtained from controllerSetup.js (raw inputs to INCREMENT, DECRMENT, GRAB, and SELECT actions/keywords) with artifacts unique methods for each action (grab(), increment(), decrement(), select(). 
//I.e for clock increment() moves handles clockwise, and decrement() counterclockwise. I.e For suitcase increment() moves lock-digits up and decrement moves lock-digits down. I.e grab() for grabbables like thread inputs artifact's Id to player's inventory[] array and triggers "thread" boolean/flag. I.e grab() for coupon inputs couponId to player's inventory[] array and triggers "coupon" flag/boolean 

import { ArtifactSystem } from '../artifactSystem/artifactSystem.js';
import { ControllerSetup } from '../controller/controllerSetup.js';
import { MultiplayerModule } from '../multiplayer/multiplayerModule.js';

export class GameSystem {
    constructor() {
        //this.artifactSystem = new ArtifactSystem();
        // Pass GameSystem instance (for back-reference)
        this.controllerSetup = new ControllerSetup(this); 
        //this.multiplayerModule = new MultiplayerModule();
        console.log("GameSystem initialized");
    }
    //Initial game setup
    initialize() {
        // Setup device detection
        this.controllerSetup.handleInput();
        
        // Initialize and load artifacts
        //this.artifactSystem.loadArtifacts(/*scene*/); //add global scene or rerefrence inside here using documdnt.query selector
        
        console.log("Game initialized and ready");
    }

    //Maps "click, keys, swipes" actions to artifact methods
    handleInputAction(action) {
        const playerPosition = this.playerPosition(); 
        const artifactInProximity = this.artifactSystem.findArtifactInProximity(playerPosition);

        //***********FOR RED *****************
        if (artifactInProximity) {
            //Performs grab, increment or decrement method of the artifcts (ex. moves suitcase digit up)
            this.artifactSystem.handleArtifactAction(artifactInProximity, action);
        } else {
            // Handle the case where no artifact is in proximity but an action is triggered
            // This could involve UI interactions or global game actions
        }
    }
    //Game's player tracking via camera location (object.getWorldPosition)
    playerPosition() {
        //obtain camera (which is player)
        const playerEntity = document.querySelector('#camera');
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