//Recieves "INCREMENT, DECREMENT, GRAB and SELECT actions from ControllerSystem, and performs the increment(), decrement(), grab() and select() methods of each unique artifact class (clock, suitcase, grabbables)"

export class ArtifactSystem {
    constructor(gameSystem) {
        console.log("ArtifactSystem initialized");
        //Populated with instances of artifacts in scene (array of artifact objects)
        this.artifacts = []; 
        //Store the reference to gameSystem for back-communication 
        this.gameSystem = gameSystem; 
        console.log("ArtifactSystem initialized with gameSystem:", this.gameSystem);
        //Player's inventory
        //contains collectables player obtains from unlocking suitcases and clocks. Contains grabbables player has collected as well
        //Inventory is an object (since we'll be adding key-value pairs of rewards, and standalone objects) --> easier to manage than an array (since arrays have specific ordering)
        this.playerInventory = {};
        //Initially false, indicating the clock is locked
        this.clockUnlock = false; 

    }

    //VARIABLES
    //Within each artifact type, change how many parameters are inside to suit accomodations
    //Ex. "View-Only" have unique positions, descriptions 9back and front) and titles (back and Front) parameters
    //Ex.  "Grabbable" have unique position and flag/boolean it triggers parameters
    //Ex. "Suitcase" have position, lock-digits, correct sequence of lock digits to unlock it, and boolean/flag it triggers parameters
    //EX. "Clock" have position, handle-digits (hour and minute), correct sequence of handles and boolean/flag it triggers parameters

    artifactsData = [
        {
          type: 'view-only',
          position: '1 1 -5',
          rotation: '0 45 0',
          scale: '1 1 1',
          //Remove geometry and material when importing gltf and unhide the URL below
          //modelUrl: './path/model.gltf',
          geometry: 'primitive:octahedron; radius:0.5;',
          material: 'color:blue; emissive:green; emissiveIntensity:0.7; metalness:0.3; roughness:0.8;',
          title: '1940s Filtering Process',
          description: 'In the 1940s, milk filtration was primarily a mechanical process, using cloth filters to remove impurities. Pasteurization, heating milk to at least 145°F (62.8°C) for 30 minutes or 161°F (71.7°C) for 15 seconds, was a common method to kill harmful bacteria.',
          label_text: '1940s Milk'
        },
        {
            type: 'view-only',
            position: '6 1 -5',
            rotation: '0 45 0',
            scale: '1 1 1',
            //Remove geometry and material when importing gltf and unhide the URL below
            modelUrl: null, //'./path/model.gltf',
            geometry: 'primitive:octahedron; radius:0.5;',
            material: 'color:blue; emissive:green; emissiveIntensity:0.7; metalness:0.3; roughness:0.8;',
            title: 'Air Transport 1930s',
            description: 'Douglas DC-3, introduced in the 1930s, revolutionized air transport with its efficiency and reliability, making commercial air travel more accessible. Other civilian aircraft of the era include the Ford Trimotor and the Boeing 247, which contributed to the development of commercial aviation',
            label_text: 'Air Transport 1930s'
          },
          ,
        {
            type: 'view-only',
            position: '5 1 2',
            rotation: '0 45 0',
            scale: '1 1 1',
            //Remove geometry and material when importing gltf and unhide the URL below
            modelUrl: null, //'./path/model.gltf',
            geometry: 'primitive:octahedron; radius:0.5;',
            material: 'color:blue; emissive:green; emissiveIntensity:0.7; metalness:0.3; roughness:0.8;',
            title: 'Quartz Clock in 1927',
            description: 'The development of the first quartz clock was in 1927 by the Candian Engineers Warren Marrison and J.W. Horton at Bell Telephone Laboratories. A pivotal moment in timekeeping, as quartz clocks were far more accurate than mechanical clocks',
            label_text: 'Quartz Clock'
          },
          ,
        {
            type: 'view-only',
            position: '6 1 3',
            rotation: '0 45 0',
            scale: '1 1 1',
            //Remove geometry and material when importing gltf and unhide the URL below
            modelUrl: null, //'./path/model.gltf',
            geometry: 'primitive:octahedron; radius:0.5;',
            material: 'color:blue; emissive:green; emissiveIntensity:0.7; metalness:0.3; roughness:0.8;',
            title: '1920s Rayon Fabric',
            description: 'In 1894, British inventors, Charles Cross, Edward Bevan, and Clayton Beadle, patented the first, safe production of artificial silk, named Viscose Rayon, composed of chemically processed cellulose. "Avtex Fibers Incorporated" first commercially produced Rayon in 1910 in the United States.',
            label_text: 'Rayon Fabric'
          },
          ,
        {
            type: 'view-only',
            position: '4 1 4',
            rotation: '0 45 0',
            scale: '1 1 1',
            //Remove geometry and material when importing gltf and unhide the URL below
            modelUrl: null, //'./path/model.gltf',
            geometry: 'primitive:octahedron; radius:0.5;',
            material: 'color:blue; emissive:green; emissiveIntensity:0.7; metalness:0.3; roughness:0.8;',
            title: 'The Mallard 4468',
            description: 'On 3 July 1938, Mallard broke the world speed record for steam locomotives at 126 mph (203 km/h), which still stands today. This A4 class locomotive was designed by the British railway Engineer Sir Nigel Gresley.',
            label_text: 'The Mallard Train'
          },
          ,
        {
            type: 'view-only',
            position: '2 1 -10',
            rotation: '0 45 0',
            scale: '1 1 1',
            //Remove geometry and material when importing gltf and unhide the URL below
            modelUrl: null, //'./path/model.gltf',
            geometry: 'primitive:octahedron; radius:0.5;',
            material: 'color:blue; emissive:green; emissiveIntensity:0.7; metalness:0.3; roughness:0.8;',
            title: 'First Espresso Machine',
            description: 'The invention of the espresso machine was by the Italian inventor Angelo Moriondo in 1884. Further improvements by Luigi Bezerra, Desiderio Pavoni and Achille Gaggia in 1904-1940s introduced the high-pressure extraction that defines espresso today',
            label_text: 'Espresso Machine'
          },
          {
            type: 'suitcase',
            digitCount: 3,
            position: '-3 1 -3',
            htmlElementId: 'suitcase-1',
            geometry: 'primitive:cube;',
            material: 'color:#B2790F; emissive:green; emissiveIntensity:0.7; metalness:0.3; roughness:0.8;',
            ////Use null if not using a GLTF model
            modelUrl: null, //'./path/to/suitcaseModel.gltf',
            //passcode, will be compared with user inputs, if match then the suitcase unlocks
            passcode: [1, 2, 3] ,
            //Rewards/items collected when unlocking the suitcase
            rewards:["handles"],
            newModelUrl: null
          },
          {
            type: 'suitcase',
            digitCount: 2,
            position: '3 1 -3',
            htmlElementId: 'suitcase-2',
            geometry: 'primitive:cube;',
            material: 'color:#B2790F; emissive:green; emissiveIntensity:0.7; metalness:0.3; roughness:0.8;',
            ////Use null if not using a GLTF model
            modelUrl: null,
            //passcode, will be compared with user inputs, if match then the suitcase unlocks
            passcode: [4,5],
            rewards:["necklace"],
            newModelUrl: null 
          },
          {
            type: 'clock',
            position: '0 1.5 -3', 
            htmlElementId: 'clock-1',
            //Flag it triggers
            //Passcode
            passcode:[270,180],
            //Reward/item obtained when you unlock clock
            rewards:["thread"],
            lockText: 'Locked! Missing Component!',
            unlockText: 'Interaction Available!',
            itemsToUnlock: ["handles"],
            faceModelUrl: null, 
            handlesModelUrl: null,
            newFaceModelUrl:null 
          },
          //Make sure ID is unique (not the same as obstacle or other grabbables)
          {
            type: 'grabbable',
            position: '-8 1 4',
            htmlElementId: '1',
            ////Use null if not using a GLTF model
            modelUrl: null, //'./path/to/suitcaseModel.gltf',
            //Rewards/items collected when unlocking the suitcase
            rewards:["coupon"]
          },
          //Make sure ID is unique (not the same as obstacle or other grabbables)
          {
            type: 'grabbable',
            position: '8 1 4',
            htmlElementId: '2',
            ////Use null if not using a GLTF model
            modelUrl: null, //'./path/to/suitcaseModel.gltf',
            //Rewards/items collected when unlocking the suitcase
            rewards:["fabric"]
          },
          //Sewing Machine
          //Make sure ID is unique (not the same as other obstacles or grabbables)
        {
            type: 'obstacle',
            position: '0 1 -4',
            htmlElementId: '3',
            ////Use null if not using a GLTF model
            modelUrl: null, //'./path/to/suitcaseModel.gltf',
            //Rewards/items collected when unlocking the suitcase
            itemsToUnlock:["fabric", "thread"], 
            reward:["code"], 
            lockText:"Locked! Missing Sewing Materials", 
            unlockText:"Sewing....New Fabric Created"
        },
        //Door
        //Make sure ID is unique (not the same as other obstacles or grabbables)
        {
            type: 'obstacle',
            position: '0 1 1',
            htmlElementId: '4',
            ////Use null if not using a GLTF model
            modelUrl: null, //'./path/to/suitcaseModel.gltf',
            //Rewards/items collected when unlocking the suitcase
            itemsToUnlock:["coupon"], 
            reward:["checkpoint"], 
            lockText:"Locked! Need Card Access", 
            unlockText:"Access Granted! Checkpoint Created"
          },
      ];

    //METHODS

    //Load and initialize artifacts 
    loadArtifacts() {
        try {
            console.log("Loading artifacts...");
            //Loop over the artifacts Array
            this.artifactsData.forEach((data) => {
                //View-Only (circlesXR pickupable objects)
                switch(data.type) {
                    case 'view-only':
                        this.loadViewOnlyArtifact(data);
                        break;
                    //Suitcase (Custom, interactable) 
                    case 'suitcase':
                        this.loadSuitcaseArtifact(data);
                        break;
                    //Clock (Custom, interactable) 
                    case 'clock':
                        this.loadClockArtifact(data);
                        break;
                    //Grabbable (Custom, dissapears from scene and saves to inventory)
                    case 'grabbable':
                        this.loadGrabbableArtifact(data);
                        break;
                    case 'obstacle':
                        this.loadObstacleArtifact(data);
                        break;
                }
            });
            console.log("All artifacts loaded:", this.artifacts);
        } catch (error) {
            console.error("Error loading artifacts:", error);
        }    
    }

    //Each artifact will be mapped to different parameters, hence the seperation of their loadings

    //Specific Loading of View-Only Artifacts
    //These are mainly observables, hence why they don't get pushed to artifactsArray (since no need for proximity detection for gameSystem States)
    loadViewOnlyArtifact(data) {
        //Create Entity
        const artifactEntity = document.createElement('a-entity');

        //Set the position, rotation, and scale from Array
        artifactEntity.setAttribute('position', data.position);
        artifactEntity.setAttribute('rotation', data.rotation);
        artifactEntity.setAttribute('scale', data.scale);

        //Check if a GLTF model URL is provided, otherwise use geometry and material
        if (data.modelUrl) {
            artifactEntity.setAttribute('gltf-model', data.modelUrl);
        } else {
            artifactEntity.setAttribute('geometry', data.geometry);
            artifactEntity.setAttribute('material', data.material);
        }

        // Set the circles-artefact attribute with Bubbles/Index Cards details
        artifactEntity.setAttribute('circles-artefact', 
        `inspectPosition:0 0 0; inspectRotation:0 0 0; inspectScale:0.8 0.8 0.8;
        textRotationY:90.0; labelLookAt:true; descriptionLookAt:true; label_offset:0.0 1.0 0.0; arrow_position:down;
        title:${data.title}; description:${data.description}; label_text:${data.label_text};`);

        //Additional circlesXR interactions or components
        artifactEntity.setAttribute('circles-pickup-object', 'animate:true;');

        //Append the artifact entity to the scene
        const scene = document.querySelector('a-scene');
        scene.appendChild(artifactEntity);
        
    }
    
    //Suitcases are Custom interactable objects and affect gameSystem (proximity checker and states), hence why they get pushed to artifactsArray
    loadSuitcaseArtifact(data) {
        const suitcase = new Suitcase(
            data.digitCount,
            //Parsing the position string into an object since in generateLocks it uses an object as parameters/reference (it was what happened to work, and I don't want to risk any new errors)
            {x: parseFloat(data.position.split(' ')[0]), y: parseFloat(data.position.split(' ')[1]), z: parseFloat(data.position.split(' ')[2])}, 
            data.htmlElementId,
            //Passing the model URL directly 
            //Use null (or delete) if using placeholder geometry
            data.modelUrl, 
            data.passcode,
            data.rewards,
            data.newModelUrl,
            //Passing an artifactSystem instance to access it's inventory methods
            this 
        );
    
        //Add the suitcase to the artifacts array
        //Artifacts array is what's used to detect objects in proximity and for gameSystem's states
        this.artifacts.push(suitcase); 
        
        //Generate the suitcase entity and its locks
        suitcase.generateSuitcaseEntities(); 
    }

    //Clocks are Custom interactable objects and affect gameSystem (proximity checker and states), hence why they get pushed to artifactsArray
    loadClockArtifact(data) {
        const clock = new Clock(
            data.position, // Make sure this matches your Clock class constructor
            data.htmlElementId,
            data.passcode,
            data.rewards,
            data.lockText,
            data.unlockText,
            data.itemsToUnlock,
            data.faceModelUrl,
            data.handlesModelUrl,
            data.newFaceModelUrl,
            //Passing an artifactSystem instance to access it's inventory methods
            this
        );
    
        //Push to the artifacts array to manage interactions
        this.artifacts.push(clock);
    
        //Generate clock's entities
        clock.generateClockEntities();
        
    }
    
    //Grabbables are Custom interactable objects and affect gameSystem (proximity checker and states), hence why they get pushed to artifactsArray
    loadGrabbableArtifact(data) {
        const grababble = new Grabbable(
            //Parsing the position string into an object since in generateLocks it uses an object as parameters/reference (it was what happened to work, and I don't want to risk any new errors)
            {x: parseFloat(data.position.split(' ')[0]), y: parseFloat(data.position.split(' ')[1]), z: parseFloat(data.position.split(' ')[2])}, 
            data.htmlElementId,
            //Passing the model URL directly 
            //Use null (or delete) if using placeholder geometry
            data.modelUrl,
            data.rewards,
            //Passing an artifactSystem instance to access it's inventory methods
            this 
        );
    
        //Add the grababble to the artifacts array
        //Artifacts array is what's used to detect objects in proximity and for gameSystem's states
        this.artifacts.push(grababble); 
        
        //Generate the grababble entity and its locks
        grababble.generateGrabEntities(); 
    }

    loadObstacleArtifact(data) {
        const obstacle = new Obstacle(
            //Parsing the position string into an object since in generateLocks it uses an object as parameters/reference (it was what happened to work, and I don't want to risk any new errors)
            {x: parseFloat(data.position.split(' ')[0]), y: parseFloat(data.position.split(' ')[1]), z: parseFloat(data.position.split(' ')[2])}, 
            data.htmlElementId,
            //Passing the model URL directly 
            //Use null (or delete) if using placeholder geometry
            data.modelUrl,
            data.itemsToUnlock, 
            data.reward, 
            data.lockText, 
            data.unlockText,
            //Passing an artifactSystem instance to access it's inventory methods
            this 
        );
    
        //Add the obstacle to the artifacts array
        //Artifacts array is what's used to detect objects in proximity and for gameSystem's states
        this.artifacts.push(obstacle); 
        
        //Generate the obstacle entity and its locks
        obstacle.generateObstacleEntities(); 
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
                //If artifact is an obstacle and Inventory items haven't been collected
                if (artifact instanceof Obstacle && !artifact.canInteract()) {
                    console.log(`Near ${artifact.name}, but cannot interact. Missing items.`);
                    //ADD UI MESSAGE
                    //DISPLAY lockedText of artifact in UI
                    return null;
                }
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
        }
    }
    
    //Adds rewards and artifacts to inventory
    addToInventory(artifact){
        console.log(`Artifact added to inventory: ${artifact}`);
        // Add artifact to inventory here
        this.playerInventory[artifact] = true;
        // Print the current state of the inventory after adding the new artifact
        console.log("Current Inventory:", this.playerInventory);
    }

    //Suitcases, Clocks, and sewing Machine give a reward or collectable when unlocking them
    //These collected-items are then added to inventory to be used in states and UI
    //The inventory is represented as an object. Each key in the object represents a reward, and the value (set to true) signifies the possession of that reward.
    addRewardsToInventory(rewards) {
        //Iterates through the rewards array of objects
        //Update the player's inventory by setting each reward's corresponding boolean to true
        rewards.forEach(reward => {
            // Update player inventory with the reward
            //Set the reward as true to signify it's been collected (useful for linear progression)
            this.playerInventory[reward] = true;
    
            // Update UI or perform any other actions needed upon receiving this reward
            console.log(`Reward collected: ${reward}`);
        });
    }
    //Removes artifact from array when it's collected or not interactable anymore
    removeFromArtifacts(htmlElementId) {
        //Filter out the artifact with the matching htmlElementId
        this.artifacts = this.artifacts.filter(artifact => artifact.htmlElementId !== htmlElementId);
    }
    
}

//ARTIFACT CLASSES 
//Artifacts categories include "Suitcase" (since there'll be multiple), "Grabbable" (Coupon, Threads, Handles, etc) and "Clock"
//Each class will have different way of interaction with it 

class Artifact {
    constructor(){
        // Initialize the selected state to false
        this.selected = false;
        //All artifacts are initially locked
        //Unlocking happens within subclasses
        this.locked = false;
    }

    //Implement the select method (overridden/extended by subclasses)
    select() {
        //The base class doesn't implement selection logic itself but provides a common interface
        console.log("Selected an artifact.");
    }
    increment(){
        console.log("incrementing");

    }
    decrement(){
        console.log("decrementing");

    }

    //Method to handle actions uniformly (overridden by subclasses) 
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
}

//Solely Grabbable and Immediately added to inventory 
//Contains only select() interactions
//references gameSystem since it requires access to playerInventory to add collected elements to inventory 
class Grabbable extends Artifact{
    constructor(position, htmlElementId, modelUrl, rewards, artifactSystem) {
        super();
        this.position = position;
        //The HTML ID of the suitcase entity
        this.htmlElementId = htmlElementId;
        //gltf ModelURL
        this.modelUrl = modelUrl;
        //Reward/item collected when unlocking the suitcase
        this.rewards = rewards;
        //Passing an artifactSystem instance to use its inventory method (to store rewards to inventory when unlocking suitcases)
        this.artifactSystem = artifactSystem;
        //Reference to the object
        this.entity = null;
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

    
    select() {
        this.entity.parentNode.removeChild(this.entity);
        this.entity = null;
        

        // Add the reward(s) to the inventory
        if (Array.isArray(this.rewards)) {
            this.rewards.forEach(reward => {
                this.artifactSystem.addToInventory(reward);
            });
        } else {
            // If there's only a single reward, add it directly
            this.artifactSystem.addToInventory(this.rewards);
        }

        //Remove from the array (to not interact with it since it's been collected)
        this.artifactSystem.removeFromArtifacts(this.htmlElementId);

    }

    increment() {
        console.log("Nothing to increment");
        
    }

    decrement() {
        console.log("Nothing to decrement");
    }

    generateGrabEntities() {
        console.log("Generating Grabbable entities...");

        //Assuming this.position is an object {x, y, z}
        const grabEntity = document.createElement('a-entity');

        if (this.modelUrl) {
            entity.setAttribute('gltf-model', this.modelUrl);
        }else{
        grabEntity.setAttribute('geometry', `primitive: box; depth: 0.5; height: 0.5; width: 4`);
        grabEntity.setAttribute('material', 'color: red');
        }
        
        //Position
        grabEntity.setAttribute('position', `${this.position.x} ${this.position.y} ${this.position.z}`);
        
        //Adding listener
        grabEntity.addEventListener('click', () => this.select());

        //Store the entity reference
        this.entity = grabEntity;

        //Add to A-Frame scene
        document.querySelector('a-scene').appendChild(grabEntity);
    }

    //Artifact is Always interactable
    canInteract() {
        return true; 
    }

}

//OBSTACLES
//Artifacts that block the linear progression until an item is collected. I.E Door (requires "coupon" access in inventory), Sewing Machine (Requires "Fabric" and "Thread")
class Obstacle extends Artifact{
    constructor(position, htmlElementId, modelUrl, itemsToUnlock, reward, lockText, unlockText, artifactSystem) {
        super();
        this.position = position;
        //The HTML ID of the suitcase entity
        this.htmlElementId = htmlElementId;
        //gltf ModelURL
        this.modelUrl = modelUrl;
        this.modelUrl = modelUrl;
        //Required items to unlock this obstacle
        this.itemsToUnlock = itemsToUnlock; 
        //Reward for unlocking
        this.reward = reward;
        //Text to show when the obstacle is locked
        this.lockText = lockText; 
        //Text to show when the obstacle is unlocked
        this.unlockText = unlockText; 
        //Passing an artifactSystem instance to use its inventory method (to store rewards to inventory when unlocking suitcases)
        this.artifactSystem = artifactSystem;
        //Reference to the object
        this.entity = null;
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

    
    select() {
        // Check if all required items are present in the inventory
        //Filters through the playerInventory and checks if matches from itemsToUnlock array are found (looks for keys)
        const allItemsPresent = this.itemsToUnlock.every(item => this.artifactSystem.playerInventory[item]);

        if (allItemsPresent) {
            console.log(this.unlockText);

            //Executing specific actions based on the obstacle type
            switch (this.htmlElementId) {
                case 'door':
                    console.log('Generating circlesXR checkpoint...');
                    //Generate circlesXR checkpoint 
                    break;
                case 'sewing machine':
                    console.log('Giving digit code to players...');
                    //Add digit code to inventory
                    this.artifactSystem.addToInventory(this.reward);
                    console.log(`${this.reward} added to inventory.`);
                    break;
                default:
                    console.log('Unknown obstacle type.');
                    break;
            }

            //Optionally, remove the obstacle from the scene
            if (this.entity) {
                this.entity.parentNode.removeChild(this.entity);
                this.entity = null;
            }

            //Remove the obstacle from the artifacts array (to disable interactions)
            this.artifactSystem.removeFromArtifacts(this.htmlElementId);
        } else {
            // Required items not present, show lock text
            console.log(this.lockText);
        }

    }

    increment() {
        console.log("Nothing to increment");
        
    }

    decrement() {
        console.log("Nothing to decrement");
    }

    generateObstacleEntities() {
        console.log("Generating Obstacle entities...");

        //Assuming this.position is an object {x, y, z}
        const obEntity = document.createElement('a-entity');

        if (this.modelUrl) {
            entity.setAttribute('gltf-model', this.modelUrl);
        }else{
            obEntity.setAttribute('geometry', `primitive: box; depth: 0.5; height: 3; width: 2`);
            obEntity.setAttribute('material', 'color: blue');
        }
        
        //Position
        obEntity.setAttribute('position', `${this.position.x} ${this.position.y} ${this.position.z}`);
        
        //Adding listener
        obEntity.addEventListener('click', () => this.select());

        //Store the entity reference
        this.entity = obEntity;

        //Add to A-Frame scene
        document.querySelector('a-scene').appendChild(obEntity);
    }

    //Artifact is Always interactable
    canInteract() {
        return true; 
    }

}

//SUITCASE
//Can manipulate digits within the suitcase 
//Contains only increment and decrement interactions
class Suitcase extends Artifact{
    constructor(digitCount, position, htmlElementId, modelUrl, passcode, rewards, newModelUrl, artifactSystem) {
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
        //gltf ModelURL
        this.modelUrl = modelUrl;
        //Password sequence to unlock the suitcase
        this.passcode = passcode;
        //Reward/item collected when unlocking the suitcase
        this.rewards = rewards;
        //Passing an artifactSystem instance to use its inventory method (to store rewards to inventory when unlocking suitcases)
        this.artifactSystem = artifactSystem;
        //Ensuring methods that use `this.artifactSystem` are bound correctly
        this.checkUnlock = this.checkUnlock.bind(this);
        this.newModelUrl = newModelUrl;
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
        this.digitTextEntities.forEach((entity, index) => {
            //If selected make digit grey, otherwise default to black
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
        //map its id
        suitcaseEntity.setAttribute('id', this.htmlElementId);
        //Sets the width based on how many locks there are (3 locks = medium width, 6 locks = large width, etc)
        suitcaseEntity.setAttribute('geometry', `primitive: box; depth: 0.5; height: 0.5; width: ${this.digitCount * 0.5}`);
        //Muted brown
        suitcaseEntity.setAttribute('material', 'color: #652A1D');
        //Position suitcase
        suitcaseEntity.setAttribute('position', `${this.position.x} ${this.position.y} ${this.position.z}`);
        
        //Add to A-Frame scene
        document.querySelector('a-scene').appendChild(suitcaseEntity);

        //Generate locks based on digitCount
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

        //INCREMENT BUTTON above the lock
        const incButton = document.createElement('a-entity');
        incButton.setAttribute('circles-button', `type: cylinder;  button_color: rgb(0,255,0); button_color_hover: rgb(180,255,180); pedestal_color: rgb(255,255,0); diameter: 0.1`);
        //Shortening buttons (they were too tall by default)
        incButton.setAttribute('scale', "1.3 0.1 1.3");
        incButton.setAttribute('rotation', `90 0 0`);
        //-0.3 is to the left of the lock 
        incButton.setAttribute('position', `${xOffset} 0.15 0.3`); 
        //IF CLICK
        incButton.addEventListener('click', () => {
            //performs decrement method/function of the Suitcase
            this.increment(digitIndex);
            //Update the displayed digit-text within array (to map to digit-text UI)
            digitText.setAttribute('value', this.digits[digitIndex].toString()); 
            //Check if input matches the passcode
            this.checkUnlock();
        });
        suitcaseEntity.appendChild(incButton);

        //DECREMENT BUTTON below the lock digits
        const decButton = document.createElement('a-entity');
        decButton.setAttribute('circles-button', `type: cylinder; button_color: rgb(255,0,0); button_color_hover: rgb(255,180,180); pedestal_color: rgb(255,255,0); diameter: 0.1`);
        //Shortening buttons (they were too tall by default)
        decButton.setAttribute('scale', "1.3 0.1 1.3");
        decButton.setAttribute('rotation', `90 0 0`);
        // Keep x same as decrement button, adjust y downwards
        decButton.setAttribute('position', `${xOffset} -0.15 0.3`); 
        //IF CLICK
        decButton.addEventListener('click', () => {
            //do decrement() method of suitcase class
            this.decrement(digitIndex);
            //Update displayed digit
            digitText.setAttribute('value', this.digits[digitIndex].toString()); 
            //Check if matches the passcode
            this.checkUnlock();
        });
        suitcaseEntity.appendChild(decButton);

    }

    //Checks the inputted sequence parameter (for artifact) with the sequence users inputted for digit-locks
    //If they match they trigger suitcase.unlock flag
    checkUnlock() {

        //Check if array is valid/exists first
        if (!Array.isArray(this.passcode)) {
            console.error('Passcode is not an array:', this.passcode);
            //exit function early
            return; 
        }
        
        //Check if rewards is valid/exists
        if(!Array.isArray(this.rewards)){
            console.log("Rewards Array is not Valid", this.rewards)
            //exit function early
            return;
        }

        //Iterate over the passcode array, if it matches the digit-locks sequence then unlock is activated (set to true)
        const unlocked = this.passcode.every((digit, index) => digit === this.digits[index]);
        //update the locked state in the class 
        //Initially locked is true, so when unlocked becomes true, locked flips to false (since object is now unlocked)
        this.locked = !unlocked;
        if (unlocked) {
            console.log("Suitcase unlocked!");
            
            //Loop over the rewards array, and add the string into the inventory
            this.rewards.forEach(reward => {
                this.artifactSystem.addToInventory(reward);
                console.log("Reward Obtained: ", this.rewards);
            });
            // Remove the original entity
            const entity = document.getElementById(this.htmlElementId);
            entity.parentNode.removeChild(entity);
               
            //Generate a new entity to show it's unlocked
            this.generateUnlockedEntity();

        } else {
            console.log("Suitcase remains locked.");
        }
    }
    //Artifact is Always interactable
    canInteract() {
        return true; 
    }
    
    //Replaces locked suitcase with the new one
    generateUnlockedEntity() {
        const unlockedEntity = document.createElement('a-entity');
        // Use GLTF model if available, otherwise use placeholder geometry
        if (this.newModelUrl) {
            unlockedEntity.setAttribute('gltf-model', this.newModelUrl);
        } else {
            unlockedEntity.setAttribute('geometry', 'primitive: box; depth: 0.5; height: 0.5; width: 1');
            unlockedEntity.setAttribute('material', 'color: green'); // Indicate unlocked
        }
        unlockedEntity.setAttribute('position', this.position);
        const scene = document.querySelector('a-scene');
        scene.appendChild(unlockedEntity);
    }

}

//CLOCK
//Can manipulate digits within the clock (hour and minute) 
//Contains only increment (clockwise) and decrement (counter clockwise) interactions
class Clock extends Artifact{
    constructor(position, htmlElementId, passcode, rewards, lockText, unlockText, itemsToUnlock, faceModelUrl,handlesModelUrl, newFaceModelUrl, artifactSystem) {
        super();
        this.position = position;
        this.htmlElementId = htmlElementId;
        //Initial rotation for hour hand
        this.hourRotation = 0; 
        //Initial rotation for minute hand
        this.minRotation = 0; 
        //Default to hour hand selected
        this.selectedHand = 'hour'; 
        //Types array for iteration over selected handle
        this.types = ['hour', 'minute']; 
        //Current index in the types array
        this.currentTypeIndex = 0; 
        //Adding a flag to prevent rapid selection
        this.canSelect = true;
        //gltf models if available
        this.faceModelUrl = faceModelUrl;
        this.handlesModelUrl = handlesModelUrl;
        //Passcode sequence to unlock clock
        this.passcode = passcode;
        //Reward/Item collected when unlocking clocks
        this.rewards = rewards;
        //Texts to display in UI for lock and Unlock states
        this.lockText = lockText;
        this.unlockText = unlockText;
        //Items required to collect to enable interaction
        this.itemsToUnlock = itemsToUnlock;
        //Passing an artifactSystem instance to use its inventory method (to store rewards to inventory when unlocking clocks)
        this.artifactSystem = artifactSystem;
        //Ensure methods that use `this.artifactSystem` are bound correctly
        this.checkUnlock = this.checkUnlock.bind(this);
        //new gltf model when unlocked
        this.newFaceModelUrl = newFaceModelUrl;
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

    select() {
        /*
        //Toggle the current type index
        //Modulo is for wrapping back to the beginning of the string array
        this.currentTypeIndex = (this.currentTypeIndex + 1) % this.types.length;
        this.selectedHand = this.types[this.currentTypeIndex];
        //UpperCase is just so that there are no errors in reading lowercase or uppsercase values
        this.selectButtonText.setAttribute('value', this.selectedHand.toUpperCase());
        //Update visuals (IF THIS DOESN'T WORK, ANOTHER SHORTCUT IS TO SWAP MODELS WITH ONE THAT HAS LIGHTER OR DIFFERENT COLOR)*/
        // Toggle the current type index
       
            //DISPLAY UI
            console.log(`${this.unlockText}`);
        
            if (this.canSelect) {
                this.currentTypeIndex = (this.currentTypeIndex + 1) % this.types.length;
                this.selectedHand = this.types[this.currentTypeIndex];
                this.selectButtonText.setAttribute('value', this.selectedHand.toUpperCase());
                console.log(`Selected hand: ${this.selectedHand}`);

                // Temporarily disable further selection
                this.canSelect = false;

                //Re-enable selection after a 10ms delay
                //Prevents the error of rapid switching between the elements in the array
                setTimeout(() => {
                    this.canSelect = true;
                }, 10); 
        }

    }

    //Rotates Handles 
    //Hours is by 30 degrees (since 360/12 = 30)
    //Minute is by 30 degrees for 5 minutes (360/60 = 6degrees per minute. 5min*6 = 30degrees for 5 minutes)
    increment() {
            if (this.selectedHand === 'hour') {
                //30 degrees for each hour
                //Modulo is for wrapping
            this.hourRotation = (this.hourRotation + 30) % 360; 
            } else {
                //6 degrees for each minute increment of 5 minutes
                //Modulo is for wrapping
            this.minRotation = (this.minRotation + 30) % 360; 
            }
            //perform rotations
            this.updateHands();
    }

    //Rotates Handles 
    //Hours is by 30 degrees (since 360/12 = 30)
    //Minute is by 30 degrees for 5 minutes (360/60 = 6degrees per minute. 5min*6 = 30degrees for 5 minutes)
    decrement() {
            if (this.selectedHand === 'hour') {
                this.hourRotation = (this.hourRotation - 30 + 360) % 360;
            } else {
                this.minRotation = (this.minRotation - 30 + 360) % 360;
            }
            this.updateHands();
    }
    
    //Generates the clock's face and hands
    generateClockEntities() {
        console.log("Generating clock entities...");
        const clockEntity = document.createElement('a-entity');
        clockEntity.setAttribute('position', this.position.toString());
        clockEntity.setAttribute('id', this.htmlElementId);

        //If glTF found, use it for the clock face, otherwise create placeholders
        if (this.faceModelUrl) {
            clockEntity.setAttribute('gltf-model', this.faceModelUrl);
        }else{
        //Clock face
        const clockFace = document.createElement('a-entity');
        clockFace.setAttribute('geometry', {primitive: 'cylinder', height: 0.1, radius: 0.3});
        //Rotate to face players
        clockFace.setAttribute('rotation', '90 0 0'); 
        //Light grey for the clock face
        clockFace.setAttribute('material', 'color', '#ccc');
        //0,0,0 means centered
        clockFace.setAttribute('position', '0 0 0'); 

        //Append faceEntity 
        //Done before the hands to ensure hands are on top
        clockEntity.appendChild(clockFace);
        }
        
        //Generate hands and interaction buttons if interaction is available
        // Wide Increment Button
        const clockIncButton = document.createElement('a-entity');
        clockIncButton.setAttribute('circles-button', `type: box; button_color: rgb(0,255,0); button_color_hover: rgb(180,255,180); pedestal_color: rgb(255,255,0); width: 1.0; height: 0.2; depth: 0.1`);
        clockIncButton.setAttribute('scale', "1 0.1 1");
        clockIncButton.setAttribute('rotation', "90 0 0");
        clockIncButton.setAttribute('position', "0.5 -0.8 0.05"); 
        clockIncButton.addEventListener('click', () => {
            this.increment();
            //Check if Input matches Passcode
            this.checkUnlock();
        });
        clockEntity.appendChild(clockIncButton);

        //Wide Decrement Button
        const clockDecButton = document.createElement('a-entity');
        clockDecButton.setAttribute('circles-button', `type: box; button_color: rgb(255,0,0); button_color_hover: rgb(255,180,180); pedestal_color: rgb(255,255,0); width: 1.0; height: 0.2; depth: 0.1`);
        clockDecButton.setAttribute('scale', "1 0.1 1");
        clockDecButton.setAttribute('rotation', "90 0 0");
        clockDecButton.setAttribute('position', "-0.5 -0.8 0.05"); 
        clockDecButton.addEventListener('click', () => {
            this.decrement();
            //Check if Input matches Passcode
            this.checkUnlock();
        });
        clockEntity.appendChild(clockDecButton);

        //Select Button Text
        const buttonText = document.createElement('a-text');
        buttonText.setAttribute('value', this.types[this.currentTypeIndex].toUpperCase());
        buttonText.setAttribute('align', 'center');
        buttonText.setAttribute('color', '#000');
        //Position will be set relative to the selectButton later
        buttonText.setAttribute('position', '0 -0.5 0.06'); 

        //Select Button
        const selectButton = document.createElement('a-entity');
        selectButton.setAttribute('circles-button', `type: box; button_color: rgb(255,213,0); button_color_hover: rgb(255,180,180); pedestal_color: rgb(255,255,0); width: 1.0; height: 0.2; depth: 0.1`);
        selectButton.setAttribute('scale', "1 0.1 1");
        selectButton.setAttribute('rotation', "90 0 0");
        selectButton.setAttribute('position', "0 -0.8 0.05");
        selectButton.addEventListener('click', () => {
            this.select();
        });

        //Ensure buttonText is a direct child of the clockEntity, not selectButton (to prevent errors)
        clockEntity.appendChild(buttonText);
        clockEntity.appendChild(selectButton);

        //Assign the reference to buttonText in the class for later use
        this.selectButtonText = buttonText;

        this.generateHand(clockEntity, 'hour', this.hourRotation);
        this.generateHand(clockEntity, 'minute', this.minRotation);
        
        
        //Append the clock entity to the scene in either case
        document.querySelector('a-scene').appendChild(clockEntity);
    }

    //Creates a cylinder for hands and corresponding Id for selection
    generateHand(clockEntity, type, rotation) {
        
        const clockHand = document.createElement('a-entity');
        if (this.handlesModelUrl) {
            //Use GLTF model for hands
            handEntity.setAttribute('gltf-model', this.handlesModelUrl);
            //Scale down for the hour hand
            handEntity.setAttribute('scale', type === 'hour' ? "0.8 0.8 0.8" : "1 1 1");
        } else{
            //For height if handle is "hour"-type give short height, otherwise set height to be longer for minute
            clockHand.setAttribute('geometry', {primitive: 'cylinder', height: type === 'hour' ? 0.1 : 0.15, radius: 0.01});
            //if hour make it orange, if minute make it blue (for easier differentiation)
            clockHand.setAttribute('material', 'color', type === 'hour' ? '#E17E0F' : '#0F25E1');
            
            
            //Position and Rotations, having minute be pointing rightwards (90 degrees) initially for easy viewing
            //Afterwards rotation increments/decrements normally
            if (type === 'minute') {
                clockHand.setAttribute('position', '-0.07 0 0.1');
                clockHand.setAttribute('rotation', `0 0 ${rotation + 90}`);
            } else {
                clockHand.setAttribute('position', '0 0.1 0.1');
                clockHand.setAttribute('rotation', `0 0 ${rotation}`);
            }
        }

        //Assign an ID based on the hand type for easy selection
        //this.htmlElementId gives generated html id, and appends the type of hand into the name so its unique
        clockHand.setAttribute('id', `${this.htmlElementId}-${type}-hand`);

        //Adding interaction capabilities
        clockHand.addEventListener('click', () => this.select(type));

        //Attach the hand to the clock
        clockEntity.appendChild(clockHand);

    }

    //Peforms actual rotation of the hands 
    updateHands() {
        const hourHand = document.getElementById(`${this.htmlElementId}-hour-hand`);
        const minuteHand = document.getElementById(`${this.htmlElementId}-minute-hand`);

        //Remove glow from both hands initially (at start)
        if (hourHand) hourHand.removeAttribute('a-glow');
        if (minuteHand) minuteHand.removeAttribute('a-glow');
        
        //The extra AND statement explicitly calls the object. It avoids the initial glitch of rotating both hands at the first increment or decrement selection
        //The increment or decrement applies if both the selected object and the elementid match --. ensures rotations are applied to the proper object with the proper state
        if (this.selectedHand === 'hour' && hourHand) {
            //this.hourrotation AND this.minrotation is specified in increment and decrement functions
            hourHand.setAttribute('rotation', `0 0 ${this.hourRotation}`);
        } else if (this.selectedHand === 'minute' && minuteHand) {
            minuteHand.setAttribute('rotation', `0 0 ${this.minRotation}`);
        }
    }
    //Passcode checker, works the same way as suitcase's
    checkUnlock() {
        const currentRotations = [this.hourRotation, this.minRotation];
        //Iterate over the passcode array, if it matches the digit-locks sequence then unlock is activated (set to true)
        const unlocked = this.passcode.every((value, index) => value === currentRotations[index]);

        this.locked = !unlocked;
        //Check if rewards is valid
        if(!Array.isArray(this.rewards)){
            console.log("Rewards Array is not Valid", this.rewards)
        }

        if (unlocked) {
            console.log("Clock unlocked!");
            
            //Loop over the rewards array and add the string into the inventory
            this.rewards.forEach(reward => {
                this.artifactSystem.addToInventory(reward);
                console.log("Reward Obtained: ", this.rewards);
            });
            
            //Remove the original entity
            const entity = document.getElementById(this.htmlElementId);
            entity.parentNode.removeChild(entity);
            // Generate a new simpler entity to show it's unlocked
            this.generateUnlockedClockEntity();

        } else {
            console.log("Clock remains locked.");
        }

        //DEBUGGING (UNHIDE WHEN WANTING TO CHECK SEQUENCE VS INPUTS)
        console.log(`Current Rotations: Hour: ${this.hourRotation}, Minute: ${this.minRotation}`);
        console.log(`Passcode: Hour: ${this.passcode[0]}, Minute: ${this.passcode[1]}`);
    }
    //Loop through "itemsToUnlock" array and check if there's a match in inventory (search for the required items in inventory)
    //returns true if it finds a match
    canInteract() {
        return this.itemsToUnlock.every(item => this.artifactSystem.playerInventory[item]);
    }
    
    //Create a new clock model when unlocked
    generateUnlockedClockEntity() {
        const clockEntity = document.createElement('a-entity');
        //Use GLTF model for the face if available, otherwise create a simple sphere as a placeholder
        if (this.newFaceModelUrl) {
            clockEntity.setAttribute('gltf-model', this.newFaceModelUrl);
        } else {
            //Simple sphere to represent the clock face
            clockEntity.setAttribute('geometry', 'primitive: sphere; radius: 0.5');
            clockEntity.setAttribute('material', 'color: #CCC');
        }
        //UNDHIDE DEBUG
        clockEntity.setAttribute('position', this.position);
        const scene = document.querySelector('a-scene');
        scene.appendChild(clockEntity);
    }


}

