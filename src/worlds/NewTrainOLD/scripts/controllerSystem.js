//Detects device being used (clicks, taps, swipes, key event listeners, gaze, etc) and converts it to "INCREMENT", "DECREMENT", AND "SELECT" custom keyword actions

export class ControllerSystem {
    InputActions = {
        SELECT: "select",
        INCREMENT: "increment",
        DECREMENT: "decrement"
    };

    constructor(gameSystem) {
        this.gameSystem = gameSystem;
        this.handleInput();
    }
    
    //Activates Interaction Keys based on Device
    //Mobile: Swipes, Single tap, and Double tap are methods of interaction
    //Desktop: "I", "J", "L" keys
    //VR: "" key, "key" and Gaze
    //For Incrementing, Decrementing, Grabbing, and Selection Actions 
    handleInput(){
        console.log("Handle Input Activated");
        // Function to activate all inputs for all devices (no need to determine device type since it can all be listened to all at one)
        this.setupVRInput();
        this.setupDesktopInput();
        this.setupMobileInput();
    }

    //************EDIT LATER***************
    //Find a way to disable look-controls via swiping, so it doesn't interfere with mobile swipe gestures
    setupMobileInput(){
        //Setup Hammer.js and event Listeners for cursors
        // Setup Hammer.js for touch inputs

        //Area where swiping is detected on mobile (VR scene)
        const interactiveArea = document.querySelector('a-scene'); 

        // Create a Hammer manager for the element
        const manager = new Hammer.Manager(interactiveArea);

        // Create a recognizer
        const Swipe = new Hammer.Swipe();

        // Add the recognizer to the manager
        manager.add(Swipe);

        // Handle swipe events
        manager.on('swipe', (event) => {
            // Determine the swipe direction (left or right) to map to decrement or increment
            let action = null;
            //For clock it's left and right, for suitcase it's up and down, hence the two gestures for incrementing (up and right) and decrementing (down and left)
            if (event.direction === Hammer.DIRECTION_LEFT) {
                action = 'DECREMENT';
                console.log(`${action} detected`);
            } else if (event.direction === Hammer.DIRECTION_RIGHT) {
                action = 'INCREMENT';
                console.log(`${action} detected`);
            }else if (event.direction === Hammer.DIRECTION_UP) { 
                action = 'INCREMENT';
                console.log(`${action} detected`);
            }else if (event.direction === Hammer.DIRECTION_DOWN) {
                action = 'DECREMENT';
                console.log(`${action} detected`);
            }

            // If an action was determined, handle it through the game system
            if (action) {
                this.gameSystem.handleInputAction(action);
            }
        });

    }

    setupDesktopInput(){
        //Setup Event Key Listeners
        
        window.addEventListener('keydown', (event) => {
            switch(event.key) {
                case "j": console.log(`${event.key} pressed`); this.gameSystem.handleInputAction('DECREMENT'); console.log('DECREMENT detected');break;
                case "k": console.log(`${event.key} pressed`); this.gameSystem.handleInputAction('INCREMENT'); console.log('INCREMENT detected');break;
                case "l": console.log(`${event.key} pressed`); this.gameSystem.handleInputAction('SELECT'); console.log('SELECT detected');break;
            }
        });

    }

    setupVRInput(){
        //Setup VR Listeners (Gaze and Button Inputs)
        console.log("VR input setup (simulation)");
    }

    // Additional utility methods as needed
}