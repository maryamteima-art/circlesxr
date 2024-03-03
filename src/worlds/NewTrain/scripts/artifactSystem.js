//Recieves "INCREMENT, DECREMENT, GRAB and SELECT actions from ControllerSystem, and performs the increment(), decrement(), grab() and select() methods of each unique artifact class (clock, suitcase, grabbables)"

export class ArtifactSystem {
    constructor() {
        console.log("ArtifactSystem initialized");
        /*************FOR RED****************/
        //Populated with instances of artifacts in scene (array of artifact objects)
        this.artifacts = []; 
        
    }
    //METHODS
    //Load and initialize artifacts here
    loadArtifacts() {
        console.log("Loading artifacts...");
        /*************FOR RED****************/
        //Initialize artifacts, Load positions and bubbles (titles, descriptions, locations)
        //Push to artifacts array --> EX. this.artifacts.push(new Suitcase(...), new Clock(...));
    }

    //INTERACTIONS - LEAVE FOR MARYAM
    //Checks proximity of each object to enable and disable object interaction
    //Distance checking, returns true if in-proximity
    //DistanceTo is a javascript built-in function that detects distance using Euclidean formula
    proximity(playerPosition, artifactPosition, interactionRadius) {
        return playerPosition.distanceTo(artifactPosition) < interactionRadius;
    }

    findArtifactInProximity(playerPosition) {
        const interactionRadius = 5; 
        for (let artifact of this.artifacts) {
            //Compare position property of an artifact with player and radius
            if (playerPosition.distanceTo(artifact.position) < interactionRadius) {
                console.log('Near artifact: Interact initiated');
                //Return the first artifact found in proximity
                return artifact; 
            }
        }
        console.log("No artifact in proximity");
        //No artifact found = NULL
        return null; 
    }
    
    //Recieves "INCREMENT, DECREMENT, GRAB and SELECT actions from ControllerSystem, and performs the increment(), decrement(), grab() and select() methods of each unique artifact class (clock, suitcase, grabbables)"
    //Parameters: Artifact object, and Action string 
    handleArtifactAction(artifact, action) {
        switch (action) {
            case 'SELECT':
                artifact.select();
                break;
            case 'INCREMENT':
                artifact.increment();
                break;
            case 'DECREMENT':
                artifact.decrement();
                break;
            case 'GRAB':
                artifact.grab();
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
    constructor(digitCount, position, htmlElementId) {
        super();
        this.digitCount = digitCount;
        this.digits = new Array(digitCount).fill(0);
        this.position = position;
        //The HTML ID of the suitcase entity
        this.htmlElementId = htmlElementId;
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
        this.digits.forEach((digit, index) => {
            const digitDisplay = document.querySelector(`#digit-${index}`);
            if (digitDisplay) {
                digitDisplay.setAttribute('value', this.digits[index].toString());
            }
        });
    }
    //Creates the Suitcase placeholder Cube, the digits Cube Bg and Interaction buttons for each lock-digit
    generateAFRAMEEntities() {
        console.log("Generating Suitcase Entities");
        /*
        //36 gives range from 0-9 and A-Z (highest alphanumeric digit)
        //2,15 is just a random string length that seemed reasonable (not too long and not too short). 2 in beginnning removes 0 Id
        const id = `suitcase-${Math.random().toString(36).substring(2, 15)}`;
        const suitcaseEntity = document.createElement('a-entity');
        suitcaseEntity.setAttribute('id', id);

        //*******************************TO EDIT *************************************
        //Position of suitcase, CHANGE TO ARRAY WHEN CREATED
        suitcaseEntity.setAttribute('position', "-1 1.5 -3");

        // Create the suitcase body
        const body = document.createElement('a-box');
        body.setAttribute('color', 'grey');
        body.setAttribute('depth', '0.1');
        body.setAttribute('height', '1');
        body.setAttribute('width', '2');
        suitcaseEntity.appendChild(body);

        for (let i = 0; i < this.digitCount; i++) {
            // Create digit display
            const digitDisplay = document.createElement('a-text');
            digitDisplay.setAttribute('value', this.digits[i].toString());
            digitDisplay.setAttribute('color', 'black');
            digitDisplay.setAttribute('position', `${i * 0.5 - 0.5} 0 0.55`);
            suitcaseEntity.appendChild(digitDisplay);

            //Create backdrop for digit display
            const backdrop = document.createElement('a-box');
            // Slightly behind the digit for depth
            backdrop.setAttribute('position', `${i * 1.5 - (this.digitCount - 1) * 0.75} 0 -0.05`); 
            backdrop.setAttribute('color', 'white');
            backdrop.setAttribute('height', '0.4');
            backdrop.setAttribute('width', '0.4');
            backdrop.setAttribute('depth', '0.1');
            suitcaseEntity.appendChild(backdrop);

            // Create increment button
            const incButton = document.createElement('a-entity');
            incButton.setAttribute('circles-button', `type: cylinder; button_color: green; diameter: 0.2`);
            //Position's above the display
            incButton.setAttribute('position', `${i * 0.5 - 0.5} 0.5 0`);
            incButton.addEventListener('click', () => this.increment(i));
            suitcaseEntity.appendChild(incButton);

            // Create decrement button
            const decButton = document.createElement('a-entity');
            decButton.setAttribute('circles-button', `type: cylinder; button_color: red; diameter: 0.2`);
            //Position's below
            decButton.setAttribute('position', `${i * 0.5 - 0.5} -0.5 0`);
            decButton.addEventListener('click', () => this.decrement(i));
            suitcaseEntity.appendChild(decButton);
        }

        // Append the suitcase entity to the scene
        document.querySelector('a-scene').appendChild(suitcaseEntity);*/
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