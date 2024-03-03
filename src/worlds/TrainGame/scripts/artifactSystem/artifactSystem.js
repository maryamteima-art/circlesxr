//Recieves "INCREMENT, DECREMENT, GRAB and SELECT actions from ControllerSystem, and performs the increment(), decrement(), grab() and select() methods of each unique artifact class (clock, suitcase, grabbables)"

export class ArtifactSystem {
    constructor() {
        console.log("ArtifactSystem initialized");
        //Populated with instances of artifacts in scene (array of artifact objects)
        this.artifacts = []; 
    }
    //METHODS
    //Load and initialize artifacts here
    loadArtifacts() {
        console.log("Loading artifacts...");
        //Initialize artifacts, Load positions and bubbles (titles, descriptions, locations)
        //Push to artifacts array --> EX. this.artifacts.push(new Suitcase(...), new Clock(...));

        //Loading Placeholder suitcase cubes, with custom number of DigitDisplays (3 locks, 4 locks, etc)
        //Ex. A suitcase with 3 digitsDisplays
        this.artifacts.push(new Suitcase(3)); 
        this.artifacts.push(new Suitcase(4));
        
    }

    //INTERACTIONS - LEAVE FOR MARYAM
    //Checks proximity of each object to enable and disable object interaction
    //Distance checking, returns true if in-proximity
    //DistanceTo is a javascript built-in function that detects distance using Euclidean formula
    proximity(playerPosition, artifactPosition, interactionRadius) {
        return playerPosition.distanceTo(artifactPosition) < interactionRadius;
    }

    findArtifactInProximity(playerPosition) {
        //Checks proximity of artifacts array (defined above in this class)
        for (let artifact of this.artifacts) {
            if (this.proximity(playerPosition, artifact.position, artifact.interactionRadius)) {
                return artifact;
            }
        }
        //No artifact in proximity
        return null; 
    }
    
    //Recieves "INCREMENT, DECREMENT, GRAB and SELECT actions from ControllerSystem, and performs the increment(), decrement(), grab() and select() methods of each unique artifact class (clock, suitcase, grabbables)"
    handleArtifactAction(artifactId, action) {
        switch (action) {
            case 'SELECT':
                artifactId.select();
                break;
            case 'INCREMENT':
                artifactId.increment();
                break;
            case 'DECREMENT':
                artifactId.decrement();
                break;
            case 'GRAB':
                artifactId.grab();
                break;
        }
    }
}

//ARTIFACT CLASSES - LEAVE FOR MARYAM SINCE THEY DEAL WITH INTERACTIONS

//Artifacts categories include "Suitcase" (since there'll be multiple), "Grabbable" (Coupon, Threads, Handles, etc) and "Clock"
//Each class will have different way of interaction with it 

//Solely Grabbable and Immediately added to inventory 
//Contains only grab interactions
class Artifact {
    grab() {
        // Logic to "grab" this artifact and adding it to the player's inventory
    }
}

//Can manipulate digits within the suitcase 
//Contains only increment and decrement interactions
class Suitcase extends Artifact{
    constructor(digitCount) {
        super();
        //Digit displays is how many lock digits to interact with
        this.digitCount = digitCount;
        this.digits = new Array(digitCount).fill(0);
        // Other initializations...
    }

    handleAction(action) {
        switch (action) {
            case InputActions.SELECT:
                this.selectElement();
                break;
            case InputActions.INCREMENT:
                this.incrementElement();
                break;
            case InputActions.DECREMENT:
                this.decrementElement();
                break;
            // Handle other actions
        }
    }

    //MAY NOT NEED THIS SINCE WE'RE USING PROXIMITY CHECKER
    selectElement() { /* Logic to select an element */ }

    //Increment the lock number UI from 1 to 9
    //0 --> 1 --> 2 until 9
    increment(digitIndex) {
        //Greater than 0 is there to ensure there's wrap around, since the count can reach the end of the list but will need to go back
        if (digitIndex >= 0 && digitIndex < this.digits.length) {
             //%10 forces the number to wrap back to 0 after reaching 9 (and users increment)
            this.digits[digitIndex] = (this.digits[digitIndex] + 1) % 10; // Example increment logic
            // Update display
            this.updateDisplay();
        }
    }

    //9 <-- 8 <-- 7 until 0
    decrement(digitIndex) {
        if (digitIndex >= 0 && digitIndex < this.digits.length) {
            //%10 forces the number to wrap back to 9 after reaching 0 (and users decrement)
            this.digits[digitIndex] = (this.digits[digitIndex] + 9) % 10;
            // Update display
            this.updateDisplay();
        }
    }
    //Updates the Digits UI
    updateDisplay() {
        //Update the visual display of digits text
        //Loop over all of the locks
        for (let i = 0; i < this.digitCount; i++) {
            //update a-text with values of locks
            const digitDisplay = document.querySelector(`#digit-${i}`);
            digitDisplay.setAttribute('text', `value: ${this.digits[i]}; color: black`);
        }
    }
    //Creates the Suitcase placeholder Cube, the digits Cube Bg and Interaction buttons for each lock-digit
    generateAFRAMEEntities() {
        const suitcaseEntity = document.createElement('a-entity');
        //Random Id for suitcase (CHANGE TO BEING THE INDEX OF ARRAY ALL SUITCASES ARE IN FOR EASIER REFERENCE)
        suitcaseEntity.setAttribute('id', `suitcase-${Math.random()}`);
        //Example position (CHANGE TO ARRAY LATER AND LOOP THROUGH THEM)
        suitcaseEntity.setAttribute('position', "-1 1.5 -3"); 

        // Loop to create digit displays and their increment/decrement buttons
        for (let i = 0; i < this.digitCount; i++) {
            // Digit Display
            const digitDisplay = document.createElement('a-box');
            //Adjust position for each digit
            //1.5 is spacing between digits-locks, and 0.75 ensures it's centered on suitcase
            digitDisplay.setAttribute('position', `${i * 1.5 - (this.digitCount - 1) * 0.75} 0 0`); 
            digitDisplay.setAttribute('color', 'white');
            digitDisplay.setAttribute('id', `digit-${i}`);
            suitcaseEntity.appendChild(digitDisplay);

            // Increment Button for this Digit
            const incButton = document.createElement('a-entity');
            incButton.setAttribute('geometry', 'primitive: circle; radius: 0.2');
            incButton.setAttribute('material', 'color: green');
            //Position above the digit
            incButton.setAttribute('position', `${i * 1.5 - (this.digitCount - 1) * 0.75} 0.5 0`);
            //Increment specific lock (lock 1, lock 2, lock 3, etc) 
            incButton.addEventListener('click', () => this.increment(i));
            //Append button to suitcase
            suitcaseEntity.appendChild(incButton);

            // Decrement Button for this Digit
            const decButton = document.createElement('a-entity');
            decButton.setAttribute('geometry', 'primitive: circle; radius: 0.2');
            decButton.setAttribute('material', 'color: red');
            //Position below the digit
            decButton.setAttribute('position', `${i * 1.5 - (this.digitCount - 1) * 0.75} -0.5 0`); 
            decButton.addEventListener('click', () => this.decrement(i));
            //Append button to suitcase
            suitcaseEntity.appendChild(decButton);
        }

        // Append the suitcase entity to the scene
        document.querySelector('a-scene').appendChild(suitcaseEntity);
        }
}

//Can manipulate digits within the clock (hour and minute) 
//Contains only increment (clockwise) and decrement (counter clockwise) interactions
class Clock extends Artifact{
    constructor(elements) {
        this.selectedElement = null;
        this.elements = elements; // Array of elements to manipulate
    }

    handleAction(action) {
        switch (action) {
            case InputActions.SELECT:
                this.selectElement();
                break;
            case InputActions.INCREMENT:
                this.incrementElement();
                break;
            case InputActions.DECREMENT:
                this.decrementElement();
                break;
            // Handle other actions
        }
    }

    selectElement() { /* Logic to select an element */ }
    incrementElement() { /* Logic to increment the selected element */ }
    decrementElement() { /* Logic to decrement the selected element */ }
}