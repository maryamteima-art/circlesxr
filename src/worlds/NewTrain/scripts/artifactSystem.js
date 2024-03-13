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
        try {
            console.log("Loading artifacts...");
            //Initialize artifacts, Load positions and bubbles (titles, descriptions, locations)
            //Push to artifacts array --> EX. this.artifacts.push(new Suitcase(...), new Clock(...));

            const suitcase = new Suitcase(3, {x: 0, y: 1, z: 0}, "suitcase-1");
            this.artifacts.push(suitcase);
            
            // Generate its A-Frame entities to visualize it in the scene
            suitcase.generateSuitcaseEntities();
        } catch (error) {
            console.error("Error loading artifacts:", error);
        }
        /*
        console.log("Loading artifacts...");
        //Initialize artifacts, Load positions and bubbles (titles, descriptions, locations)
        //Push to artifacts array --> EX. this.artifacts.push(new Suitcase(...), new Clock(...));

        const suitcase = new Suitcase(3, {x: -3, y: 1, z: -3}, "suitcase-1");
        this.artifacts.push(suitcase);
        
        // Generate its A-Frame entities to visualize it in the scene
        suitcase.generateSuitcaseEntities();*/

    }

    //Checks proximity of each object to enable and disable object interaction
    //Distance checking, returns true if in-proximity
    //DistanceTo is a javascript built-in function that detects distance using Euclidean formula
    proximity(playerPosition, artifactPosition, interactionRadius) {
        return playerPosition.distanceTo(artifactPosition) < interactionRadius;
    }

    findArtifactInProximity(playerPosition) {
        const interactionRadius = 2.5; 
        for (let artifact of this.artifacts) { 
            //Compare position property of an artifact with player and radius
            //Since artifacts positions are objects within the array {x,y,z}, need to convert to three.js to be compatible with playerPosition (since it's three.js vector)
            if (playerPosition.distanceTo(new THREE.Vector3(artifact.position.x, artifact.position.y, artifact.position.z)) < interactionRadius) {
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
        //how many locks in suitcase
        this.digitCount = digitCount;
        //Actual numbers of the each of the locks (1-9) Ex. [lock 1 #, lock 2 #, lock 3 #]
        this.digits = new Array(digitCount).fill(0);
        this.position = position;
        //The HTML ID of the suitcase entity
        this.htmlElementId = htmlElementId;
        //Added for selecting lock digits via keys (as opposed to clicking circlesXR buttons for users who prefer keys)
        this.selectedDigitIndex = 0; 
        this.digitTextEntities = [];
    }

    handleAction(action) {
        switch (action) {
            case InputActions.SELECT:
                this.select();
                break;
            case InputActions.INCREMENT:
                this.increment();
                break;
            case InputActions.DECREMENT:
                this.decrement();
                break;
            // Handle other actions
        }
    }

    //Allows players to select the lock to manipulate if using keys (Ex. Desktop you use L key to loop through the digits to increment() and decrement() them)
    select() {
        // Cycle through digits from left to right
        this.selectedDigitIndex = (this.selectedDigitIndex + 1) % this.digits.length;

        // Update visual indication for all digits
        this.digitTextEntities.forEach((entity, index) => {
            //If selected is true, change to light gray, otherwise reset to black
            entity.setAttribute('color', index === this.selectedDigitIndex ? '#668' : '#000');
        });

    }
    
    //Deselect all Digits and Default the texts to black
    resetSelection() {
        // Deselect any previously selected digit
        // Reset color of all digit entities to black and deselect them all
        this.digitTextEntities.forEach(entity => entity.setAttribute('color', '#000'));
        this.selectedDigitIndex = null;
    }

    //Quickly Select and Reselects digits (mitigates the issue of double incrementation and decrementation)
    //Quickly unselects and reselects the digit without changes visually (so users don't have to reselect digits each time to increment or decrement by 1)
    unSelectReselectDigit() {
        //If selection detected
        if (this.selectedDigitIndex !== null) {
            //Set currentSelection to the index in digitsArray
            const currentSelection = this.selectedDigitIndex;
            // Temporarily reset selection
            this.resetSelection();
            // Force a minimal delay before reselecting to ensure the UI refreshes properly
            //Users don't see this change visually (since it's 10ms), but it mitigates the issue of double incrementing and decrementing
            setTimeout(() => {
                this.selectedDigitIndex = currentSelection;
                this.updateSelectionVisuals();
                // 10 milliseconds delay
            }, 10); 
        }
    } 

    //Updates the visuals of texts to a digit is selected
    updateSelectionVisuals() {
        //If selected make digit grey, otherwise default to black
        this.digitTextEntities.forEach((entity, index) => {
            entity.setAttribute('color', index === this.selectedDigitIndex ? '#668' : '#000');
        });
    }

    //Increment the lock number UI from 1 to 9
    //0 --> 1 --> 2 until 9
    increment(digitIndex) {
        //Reset selection if it's a button click, not a key press (digitIndex is defined)
        //Prevents manipulation of two digitlocks (previously selected one and current one)
        if (digitIndex !== undefined) {
            this.resetSelection();
        }
        
        // Now perform increment based on whether it's a button click or key press
        if (digitIndex !== undefined && digitIndex >= 0 && digitIndex < this.digits.length) {
            // CirclesXR Button click, therefore, Increment the specified digit-lock only
            //+1 and %10 forces the number to wrap back to 0 after reaching 9 (and users increments)
            this.digits[digitIndex] = (this.digits[digitIndex] + 1) % 10;
        } else if (this.selectedDigitIndex !== null) {
            // Key is pressed, therefore increment the selected digit only
            this.digits[this.selectedDigitIndex] = (this.digits[this.selectedDigitIndex] + 1) % 10;
            this.unSelectReselectDigit();
        }
        // Update display in all cases
        this.updateDisplay();
    }

    //Decrement the lock number UI from 9 down to 0
    decrement(digitIndex) {
        //Reset selection if it's a button click, not a key press (digitIndex is defined)
        //Prevents Manipulation of two locks (previously selected and current)
        if (digitIndex !== undefined) {
            this.resetSelection();
        }
        
        //Now perform decrement based on whether it's a button click or key press
        if (digitIndex !== undefined && digitIndex >= 0 && digitIndex < this.digits.length) {
            // CirclesXR Button click which means decrement the specified digit only
            //+9 and %10 forces the number to wrap back to 9 after reaching 0 (and users decrements)
            this.digits[digitIndex] = (this.digits[digitIndex] + 9) % 10;
        } else if (this.selectedDigitIndex !== null) {
            //Key is pressed, thus decrement the selected digit
            this.digits[this.selectedDigitIndex] = (this.digits[this.selectedDigitIndex] - 1 + 10) % 10;
            this.unSelectReselectDigit();
        }
        // Update display in all cases
        this.updateDisplay();
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

        //FOR SELECTION KEYS
        //Loop through the digits array
        this.digits.forEach((digit, index) => {
            //If selected entity changes
            if (this.digitTextEntities[index]) {
                //update its value
                this.digitTextEntities[index].setAttribute('value', digit.toString());
            }
        });
    }

    generateSuitcaseEntities() {
        console.log("Generating suitcase entities...");

        //Assuming this.position is an object {x, y, z}
        //CHANGE WHEN FIGURING OUT LOADING OF ARTIFACT OBJECTS
        const suitcaseEntity = document.createElement('a-entity');
        //Sets the width based on how many locks there are (3 locks = medium width, 6 locks = large width, etc)
        suitcaseEntity.setAttribute('geometry', `primitive: box; depth: 0.5; height: 0.5; width: ${this.digitCount * 0.5}`);
        //Muted brown
        suitcaseEntity.setAttribute('material', 'color: #652A1D');
        //Position suitcase
        suitcaseEntity.setAttribute('position', `${this.position.x} ${this.position.y} ${this.position.z}`);
        
        // Add to A-Frame scene
        document.querySelector('a-scene').appendChild(suitcaseEntity);

        // Generate locks based on digitCount
        for (let i = 0; i < this.digitCount; i++) {
            // Calculate lock position based on suitcase width and digit count
            //this.digitCount / 2 - 0.5 calculates midppoint of all the locks
            //0.2 was just a random scale to have the digits-buffer beside each other
            //i- calculates distance of the lock relative to the centre of the suitcase 
            let lockXPosition = (i - (this.digitCount / 2 - 0.5)) * 0.2; 
            this.generateLock(suitcaseEntity, i, lockXPosition);
        }
    }

    //Creates a singular lock object
    //xxOffset is the space between each of the locks so they're positioned evenly horizontally 
    //Locks are positioned relative/atop suitcase, hence referencing of suitcase entity (locks are its children)
    generateLock(suitcaseEntity, digitIndex, xOffset) {
        console.log("Generating locks for suitcase entities...");

        //DIGIT TEXT (actual numbers of the locks)
        const digitText = document.createElement('a-text');
        digitText.setAttribute('value', this.digits[digitIndex].toString());
        //Set text color to black
        digitText.setAttribute('color', '#000');
        digitText.setAttribute('align', 'center');
        // 0.4 is tested value. Slightly places in front of the lock backdrop plane
        //0.02 positions the numbers slighty up
        digitText.setAttribute('position', `${xOffset} 0.025 0.4`); 
        digitText.setAttribute('scale', "0.8 0.8 0.8");
        //Append child makes the positions relative
        suitcaseEntity.appendChild(digitText);
        // Add digitText to the array for Selection Access (Ex. L Key on desktop)
        this.digitTextEntities.push(digitText);

        
        
        //DIGIT DISPLAY (text's backdrop)
        const lockEntity = document.createElement('a-entity');
        lockEntity.setAttribute('position', `${xOffset} 0 0.3`); 
        lockEntity.setAttribute('geometry', `primitive: plane; width: 0.8; height: 0.3`);
        //Pinkish-White
        lockEntity.setAttribute('material', 'color: #FCE6E2');
        suitcaseEntity.appendChild(lockEntity);

        //DECREMENT BUTTON above the lock
        const decButton = document.createElement('a-entity');
        decButton.setAttribute('circles-button', `type: cylinder; button_color: rgb(255,0,0); button_color_hover: rgb(255,180,180); pedestal_color: rgb(255,255,0); diameter: 0.1`);
        //Shortening buttons (they were too tall by default)
        decButton.setAttribute('scale', "1.3 0.1 1.3");
        decButton.setAttribute('rotation', `90 0 0`);
        //-0.3 is to the left of the lock 
        decButton.setAttribute('position', `${xOffset} 0.15 0.3`); 
        //IF CLICK
        decButton.addEventListener('click', () => {
            //performs decrement method/function of the Suitcase
            this.decrement(digitIndex);
            //Update the displayed digit-text within array (to map to digit-text UI)
            digitText.setAttribute('value', this.digits[digitIndex].toString()); 
        });
        suitcaseEntity.appendChild(decButton);

        //INCREMENT BUTTON below the lock digits
        const incButton = document.createElement('a-entity');
        incButton.setAttribute('circles-button', `type: cylinder; button_color: rgb(0,255,0); button_color_hover: rgb(180,255,180); pedestal_color: rgb(255,255,0); diameter: 0.1`);
        //Shortening buttons (they were too tall by default)
        incButton.setAttribute('scale', "1.3 0.1 1.3");
        incButton.setAttribute('rotation', `90 0 0`);
        // Keep x same as decrement button, adjust y downwards
        incButton.setAttribute('position', `${xOffset} -0.15 0.3`); 
        //IF CLICK
        incButton.addEventListener('click', () => {
            //do increment() method of suitcase class
            this.increment(digitIndex);
            digitText.setAttribute('value', this.digits[digitIndex].toString()); // Update displayed digit
        });
        suitcaseEntity.appendChild(incButton);

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

//EVENT EMITTER
/*
class EventEmitter {
    constructor() {
        this.events = {};
    }

    on(event, listener) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
    }

    emit(event, ...args) {
        if (this.events[event]) {
            this.events[event].forEach(listener => listener(...args));
        }
    }
}
*/
