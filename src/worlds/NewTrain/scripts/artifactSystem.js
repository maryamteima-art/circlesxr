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
        //binding
        this.createOrUpdateUIImage = this.createOrUpdateUIImage.bind(this);
        
        //Progress Bar
        //2 suitcases, 1 door, 1 sewing machine, 1 necklace, 1 clock
        this.totalArtifacts = 5;
        this.unlockedArtifacts = 0; 
        this.initializeProgressBar();

        //Checkpoints
        //this.initializeCheckpoints();

        //Camera UI Elements
        //Specific maps of images to solo items like teh clock and suitcases
        //for elements like suitcases and clocks, there are pieces of paper that reveal codes.
        //Once a suitcase (or clock) is unlocked, there's no point in keeping the coded papers. 
        //Since these coded papers are not in a list, we need to create a dictionary that specifies which images is for which Id (suitcase id and clock id)
        //This allows for specific deletion of images based on the passcoded element being unlocked
        
        //Suitcase-1 is not included in this map since it is an observational puzzle (code is obtained from looking at posters)
        this.artifactToImageMap = {
            'suitcase-2': 'paper.png',
            //This is sewing machine
            'sewingMachine': 'otherFabric.png'
            // Add more mappings as needed
        };

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
          position: '-1.32 1.798 -51.4',
          rotation: '0 45 0',
          scale: '1 1 1',
          //Remove geometry and material when importing gltf and unhide the URL below
          modelUrl: null,
          objModelUrl:null, 
          mtlUrl:null,
          geometry: 'primitive:octahedron; radius:0.5;',
          material: 'color:yellow; emissive:orange; emissiveIntensity:0.7; metalness:0.3; roughness:0.8;',
          title: '1940s Filtering Process',
          description: 'In the 1940s, milk filtration was primarily a mechanical process, using cloth filters to remove impurities. Pasteurization, heating milk to at least 145°F (62.8°C) for 30 minutes or 161°F (71.7°C) for 15 seconds, was a common method to kill harmful bacteria',
          label_text: '1940s Milk',
          //Audio file path
          audio: "cards/Milk.mp3", 
          volume: 1.0
        },
        {
            type: 'view-only',
            position: '4.075 0.794 11.82',
            rotation: '0 45 0',
            scale: '1 1 1',
            //Remove geometry and material when importing gltf and unhide the URL below
            modelUrl: null, 
            objModelUrl:null,
            mtlUrl:null,
            geometry: 'primitive:octahedron; radius:0.5;',
            material: 'color:yellow; emissive:orange; emissiveIntensity:0.7; metalness:0.3; roughness:0.8;',
            title: 'Air Transport 1930s',
            description: 'Douglas DC-3, introduced in the 1930s, revolutionized air transport with its efficiency and reliability, making commercial air travel more accessible. Other civilian aircraft of the era include the Ford Trimotor and the Boeing 247, which contributed to the development of commercial aviation',
            label_text: 'Air Transport 1930s',
            //Audio file path
            audio: "cards/AirTransport.mp3", 
            volume: 1.0
          },
          ,
        {
            type: 'view-only',
            position: '4.4 1.5 -45.71',
            rotation: '0 45 0',
            scale: '1 1 1',
            //Remove geometry and material when importing gltf and unhide the URL below
            modelUrl: null, 
            objModelUrl:null, 
            mtlUrl:null,
            geometry: 'primitive:octahedron; radius:0.5;',
            material: 'color:yellow; emissive:orange; emissiveIntensity:0.7; metalness:0.3; roughness:0.8;',
            title: 'Quartz Clock in 1927',
            description: 'The development of the first quartz clock was in 1927 by the Canadian Engineers Warren Marrison and J.W. Horton at Bell Telephone Laboratories. A pivotal moment in timekeeping, as quartz clocks were far more accurate than mechanical clocks',
            label_text: 'Quartz Clock',
            //Audio file path
            audio: "cards/QuartzClock.mp3", 
            volume: 1.0
          },
        {
            type: 'view-only',
            position: '4.075 0.794 0.342',
            rotation: '0 45 0',
            scale: '1 1 1',
            //Remove geometry and material when importing gltf and unhide the URL below
            modelUrl: null,
            objModelUrl:null,
            mtlUrl:null,
            geometry: 'primitive:octahedron; radius:0.5;',
            material: 'color:yellow; emissive:orange; emissiveIntensity:0.7; metalness:0.3; roughness:0.8;',
            title: '1920s Rayon Fabric',
            description: 'In 1894, British inventors, Charles Cross, Edward Bevan, and Clayton Beadle, patented the first, safe production of artificial silk, named Viscose Rayon, composed of chemically processed cellulose. "Avtex Fibers Incorporated" first commercially produced Rayon in 1910 in the United States',
            label_text: 'Rayon Fabric',
            //Audio file path
            audio: "cards/Rayon.mp3", 
            volume: 1.0
          },
        {
            type: 'view-only',
            position: '-4.442 1.721 -1.975',
            rotation: '0 45 0',
            scale: '1 1 1',
            //Remove geometry and material when importing gltf and unhide the URL below
            modelUrl: null,
            objModelUrl:null, 
            mtlUrl:null, 
            geometry: 'primitive:octahedron; radius:0.5;',
            material: 'color:yellow; emissive:orange; emissiveIntensity:0.7; metalness:0.3; roughness:0.8;',
            title: 'The Mallard 4468',
            description: 'On 3 July 1938, Mallard broke the world speed record for steam locomotives at 126 mph (203 km/h), which still stands today. This A4 class locomotive was designed by the British railway Engineer Sir Nigel Gresley',
            label_text: 'The Mallard Train',
            //Audio file path
            audio: "cards/TheMallard.mp3", 
            volume: 1.0
          },
        {
            type: 'view-only',
            position: '-2.538 1.871 -39.517',
            rotation: '0 45 0',
            scale: '1 1 1',
            //Remove geometry and material when importing gltf and unhide the URL below
            modelUrl: null,
            objModelUrl:null, 
            mtlUrl:null,
            geometry: 'primitive:octahedron; radius:0.5;',
            material: 'color:yellow; emissive:orange; emissiveIntensity:0.7; metalness:0.3; roughness:0.8;',
            title: 'First Espresso Machine',
            description: 'The invention of the espresso machine was by the Italian inventor Angelo Moriondo in 1884. Further improvements by Luigi Bezerra, Desiderio Pavoni and Achille Gaggia in 1904-1940s introduced the high-pressure extraction that defines espresso today',
            label_text: 'Espresso Machine',
            //Audio file path
            audio: "cards/EspressoMachine.mp3", 
            volume: 1.0
          },
          {
              type: 'view-only',
              position: '-3.38 1.2 -72.12',
              rotation: '0 45 0',
              scale: '1 1 1',
              //Remove geometry and material when importing gltf and unhide the URL below
              modelUrl: null, 
              objModelUrl:null, 
              mtlUrl:null,
              geometry: 'primitive:octahedron; radius:0.5;',
              material: 'color:yellow; emissive:orange; emissiveIntensity:0.7; metalness:0.3; roughness:0.8;',
              title: 'Sewing in 1940s',
              description: 'Early sewing machines in the 1940s typically had between 1 to 2 gears for basic stitching functions. These machines were constructed from cast iron or steel, making them last well over 70 years but weighing 30-40 Ibs. The use of aluminum became more common in later models to reduce weight',
              label_text: 'Sewing Machine',
              //Audio file path
              audio: "cards/SewingMachine.mp3", 
              volume: 1.0
            },
        {
            type: 'view-only',
            position: '2.7 0.794 -70.45',
            rotation: '0 45 0',
            scale: '1 1 1',
            //Remove geometry and material when importing gltf and unhide the URL below
            modelUrl: null,
            objModelUrl:null,
            mtlUrl:null,
            geometry: 'primitive:octahedron; radius:0.5;',
            material: 'color:yellow; emissive:orange; emissiveIntensity:0.7; metalness:0.3; roughness:0.8;',
            title: 'Suitcases in 1940s',
            description: 'Suitcases began to transition from heavy trunks and wooden boxes into portable designs using fiberboard and plywood. Later incorporating synthetic materials in 1950s, like vinyl and nylon, for lighter, more durable, and water-resistant luggage marked a significant shift for train travel in Canada',
            label_text: '1940-1950s Luggage',
            //Audio file path
            audio: "cards/Luggage.mp3", 
            volume: 1.0
          },
          {
            type: 'suitcase',
            digitCount: 4,
            position: '3.7 0.927 -82.24',
            htmlElementId: 'suitcase-1',
            geometry: 'primitive:cube;',
            material: 'color:#B2790F; emissive:green; emissiveIntensity:0.7; metalness:0.3; roughness:0.8;',
            //Use null if not using a GLTF model
            //CHANGE MODEL TO HAVE NO HANDLES TEXTURE 
            modelUrl: "compressed/ClosedSuitcase.glb",
            objModelUrl:null, 
            mtlUrl:null,
            //passcode, will be compared with user inputs, if match then the suitcase unlocks
            passcode: [6,3,2,9] ,
            //Rewards/items collected when unlocking the suitcase
            rewards:["paper"],
            //newEntity/unlock
            newModelUrl:"#suitcaseOpen",
            newObjModelUrl:null, 
            newMtlUrl:null
          },
          {
            type: 'suitcase',
            digitCount: 4,
            position: '-4.219 0.970 -94.266',
            htmlElementId: 'suitcase-2',
            geometry: 'primitive:cube;',
            material: 'color:#B2790F; emissive:green; emissiveIntensity:0.7; metalness:0.3; roughness:0.8;',
            //Use null if not using a GLTF model
            modelUrl: "compressed/ClosedSuitcase.glb",
            objModelUrl:null, 
            mtlUrl:null,
            //passcode, will be compared with user inputs, if match then the suitcase unlocks
            passcode: [6,1,5,8],
            rewards:["necklace"],
            //new entity/unlock
            newModelUrl: "#suitcaseOpen",
            newObjModelUrl:null, 
            newMtlUrl:null 
          },
          {
            type: 'clock',
            position: '3.448 0.543 -45.94', 
            htmlElementId: 'clock-1',
            //Flag it triggers
            //Passcode
            passcode:[150,270],
            //Reward/item obtained when you unlock clock
            rewards:["thread"],
            lockText: 'Locked! Missing Component!',
            unlockText: 'Interaction Available!',
            itemsToUnlock: [""],
            faceModelUrl: "compressed/Clock.glb", 
            handlesModelUrl: "compressed/Handles.glb",
            newFaceModelUrl:"#clockOpen",
            //handles
            objModelUrl:null, 
            mtlUrl:null, 
            faceObjModelUrl:null, 
            faceMtlUrl:null, 
            //face
            newObjModelUrl:null, 
            newMtlUrl:null
          },
          //Make sure ID is unique (not the same as obstacle or other grabbables)
          {
            type: 'grabbable',
            position: '-2.4 -0.429 -12.54',
            htmlElementId: '1',
            //Use null if not using a GLTF model
            modelUrl: "compressed/Coupon.glb",
            objModelUrl:null, 
            mtlUrl:null,
            //Rewards/items collected 
            rewards:["coupon"]
          },
          //Make sure ID is unique (not the same as obstacle or other grabbables)
          {
            type: 'grabbable',
            position: '3 -0.45 0.8',
            htmlElementId: '2',
            ////Use null if not using a GLTF model
            modelUrl: "compressed/Fabric.glb",
            objModelUrl:null, 
            mtlUrl:null,
            //Rewards/items collected 
            rewards:["fabric"]
          },
          //Sewing Machine
          //Make sure ID is unique (not the same as other obstacles or grabbables)
        {
            type: 'obstacle',
            position: '-3.46 0.319 -69.81',
            htmlElementId: 'sewingMachine',
            ////Use null if not using a GLTF model
            modelUrl: "compressed/SewingMachine.glb",
            objModelUrl:null, 
            mtlUrl:null,
            //Rewards/items collected when unlocking the suitcase
            itemsToUnlock:["fabric", "thread"], 
            reward:["otherFabric"], 
            lockText:"Locked! Missing Sewing Materials", 
            unlockText:"Sewing....\n Code-6158 Obtained"
        },
        //Door
        //Make sure ID is unique (not the same as other obstacles or grabbables)
        {
            type: 'obstacle',
            position: '0 1 -24',
            htmlElementId: 'door',
            ////Use null if not using a GLTF model
            modelUrl: null,
            objModelUrl:null, 
            mtlUrl:null,
            //Rewards/items collected when unlocking the suitcase
            itemsToUnlock:["coupon"], 
            reward:["checkpoint"], 
            lockText:"Locked! Need Card Access", 
            unlockText:"Access Granted! Checkpoint Created"
          }
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
        } else if (data.objModelUrl && data.mtlUrl) {
            // Set the obj-model attribute using the OBJ and MTL files
            artifactEntity.setAttribute('obj-model', `obj: url(${data.objModelUrl}); mtl: url(${data.mtlUrl})`);
        }
        else {
            artifactEntity.setAttribute('geometry', data.geometry);
            artifactEntity.setAttribute('material', data.material);
        }

        // Set the circles-artefact attribute with Bubbles/Index Cards details
        artifactEntity.setAttribute('circles-artefact', 
        `inspectPosition:0 0 0; inspectRotation:0 0 0; inspectScale:0.8 0.8 0.8;
        textRotationY:90.0; labelLookAt:true; descriptionLookAt:true; label_offset:0.0 1.0 0.0; arrow_position:down;
        title:${data.title}; description:${data.description}; label_text:${data.label_text}; audio:${data.audio};
        volume: ${data.volume};`);

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
            data.objModelUrl, 
            data.mtlUrl,
            //unlock
            data.newObjModelUrl, 
            data.newMtlUrl,
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
            data.objModelUrl, 
            data.mtlUrl,
            data.faceObjModelUrl, 
            data.faceMtlUrl, 
            //New face
            data.newObjModelUrl, 
            data.newMtlUrl,
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
            data.objModelUrl, 
            data.mtlUrl,
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
            data.objModelUrl, 
            data.mtlUrl,
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
        const interactionRadius = 5; 
        for (let artifact of this.artifacts) { 
            //Compare position property of an artifact with player and radius
            //Since artifacts positions are objects within the array {x,y,z}, need to convert to three.js to be compatible with playerPosition (since it's three.js vector)
            if (playerPosition.distanceTo(new THREE.Vector3(artifact.position.x, artifact.position.y, artifact.position.z)) < interactionRadius) {
                //If artifact is an obstacle and Inventory items haven't been collected
                if (artifact instanceof Obstacle && !artifact.canInteract()) {
                    console.log(`Near ${artifact.name}, but cannot interact. Missing items.`);
                    //ADD UI MESSAGE
                    
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
    //Suitcases, Clocks, and sewing Machine give a reward or collectable when unlocking them
    //These collected-items are then added to inventory to be used in states and UI
    //The inventory is represented as an object. Each key in the object represents a reward, and the value (set to true) signifies the possession of that reward.
    addToInventory(artifact){
        console.log(`Artifact added to inventory: ${artifact}`);
        //Add artifact to inventory here
        this.playerInventory[artifact] = true;
        //If necklace trigger a win condition
        if (artifact === "necklace") {
            // Call a method on `gameSystem` to check for win condition
            this.gameSystem.checkWinCondition();
            //update progress bar
            
        }
        // Print the current state of the inventory after adding the new artifact
        console.log("Current Inventory:", this.playerInventory);
    }

    //CHECK IF THIS IS USED OR OUTDATED, DELETE IF YES
    
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

    //Removes item from inventory (to accurately update UI images in Camera)
    removeFromInventory(items) {
        // Ensure items is always an array, even if a single item string is passed
        items = Array.isArray(items) ? items : [items];

        items.forEach(item => {
            if (this.playerInventory[item]) {
                delete this.playerInventory[item];
                console.log(`Item removed from inventory: ${item}`);
            } else {
                console.log(`Item not found in inventory: ${item}`);
            }
        });
    }

    //Removes artifact from array when it's collected or not interactable anymore
    removeFromArtifacts(htmlElementId) {
        //Filter out the artifact with the matching htmlElementId
        this.artifacts = this.artifacts.filter(artifact => artifact.htmlElementId !== htmlElementId);
    }
    
    //Creates a text entity in camera and updates using lockText and unlockText of Suitcases, clock, doors, sewing machine
    createOrUpdateUIText(message) {
        // Obtain the A-Frame camera entity, which represents the player's view
        const cameraEntity = CIRCLES.getMainCameraElement();
    
        // Check if the text entity already exists
        let textEntity = document.getElementById('ui-text-entity');
    
        // If it doesn't exist, create a new text entity
        if (!textEntity) {
            textEntity = document.createElement('a-text');
            textEntity.setAttribute('id', 'ui-text-entity');
            textEntity.setAttribute('position', '-0.6 -0.7 -1'); 
            textEntity.setAttribute('width', '2'); 
            textEntity.setAttribute('color', 'white'); 
    
            // Append the text entity to the camera so it moves with the player
            cameraEntity.appendChild(textEntity);
        }
    
        // Update the message displayed by the text entity
        textEntity.setAttribute('value', message);
    }

    //Creates a image entity in camera and updates using inventory elements match (key to filename matches)
    createOrUpdateUIImage() {
        //Obtain the A-Frame camera entity, which represents the player's view
        const cameraEntity = CIRCLES.getMainCameraElement();
        
        //Get all existing images except the progress bar and the eye icon
        const existingImages = cameraEntity.querySelectorAll('a-image:not(#progress-bar-image)');

        //Remove/clear existing images except for the progress bar and the eye icon (refreshes UI)
        existingImages.forEach(img => img.parentNode.removeChild(img));

        //Add new images based on the inventory keys
        Object.keys(this.playerInventory).forEach((item, index) => {
            if (this.playerInventory[item]) {
                var imgEntity = document.createElement('a-image');
                //Keys and image's names are the same, hence we can just use key as item name, and deduce which image to show for each collectable dynamically
                imgEntity.setAttribute('src', `images/${item}.png`);
                
                //Adjust position for each item, this one is centre
                //imgEntity.setAttribute('position', `${index * 0.55} 0 -2`); 
                
                //Seting position to bottom left, moving rightwards for each item
                let xOffset = -1.2 + 0.6 * index; 
                let yOffset = -0.9; 
                imgEntity.setAttribute('position', `${xOffset} ${yOffset} -2`);
                
                imgEntity.setAttribute('width', '0.5');
                imgEntity.setAttribute('height', '0.5');
                cameraEntity.appendChild(imgEntity);
            }
        });
    }
    //For OBSTACLES ONLY
    //Iterates over an array, and removes elements required to unlock the obstacle (to inidicate the items have been used)
    removeUsedArtifactImages(usedItems) {
        const cameraEntity = CIRCLES.getMainCameraElement();
        //Loop over a list (in this case "itemsToUnlock" list which has Items that are required to unlock an obstacle or artifact)
        usedItems.forEach(item => {
            //Remove the images with the same names as elements in the array (since this indicates they've been used)
            let imgEntity = cameraEntity.querySelector(`a-image[src="images/${item}.png"]`);
            if (imgEntity) {
                imgEntity.parentNode.removeChild(imgEntity);
            }
        });
    }
    //For artifacts with coded papers in inventory (suitcases and clocks) 
    //Removes image from camera based on entity unlocked
    removeImageForArtifact(htmlElementId) {
        const imageElement = document.querySelector(`#image-${htmlElementId}`);
        if (imageElement) {
            imageElement.parentNode.removeChild(imageElement);
        }
    }

    //Generate a progress bar and attach to camera
    initializeProgressBar() {
        const cameraEntity = CIRCLES.getMainCameraElement();
    
        //Create the image entity for the progress bar
        //Bar0 is base image 
        // Create the image entity for the progress bar
        this.progressBarImage = document.createElement('a-image');
        this.progressBarImage.setAttribute('src', 'images/bar0.png');
        //ID for progress bar
        this.progressBarImage.setAttribute('id', 'progress-bar-image'); 
        this.progressBarImage.setAttribute('position', '1 -1.2 -2');
        this.progressBarImage.setAttribute('width', '0.6');
        this.progressBarImage.setAttribute('height', '0.2');

        //Attach progress bar to the camera
        cameraEntity.appendChild(this.progressBarImage);
    }

    //Swap images based on how many artifacts have been unlocked
    //Door, Suitcase-1, clock, sewing machine, suitcase-2 = 5 progress tasks = 5 bar images 
    updateProgressBar() {
        //Increment the number of unlocked artifacts
        this.unlockedArtifacts++;
        //The number (number of artifacts completed) is the same as image number to enable quick mapping (just search for the same number in image name)
        const imageName = `images/bar${this.unlockedArtifacts}.png`;
        // Force A-Frame to update the element by re-setting the src attribute
        this.progressBarImage.setAttribute('src', '');
        this.progressBarImage.setAttribute('src', imageName);
    }

    //Generates a teleport checkpoint entity when a condition is met (in this case when door is unlocked)
    createTeleportCheckpoint(position, targetPosition) {
        const checkpoint = document.createElement('a-entity');
        checkpoint.setAttribute('geometry', 'primitive: cylinder; height: 0.05; radius: 0.1');
        //Dark brown
        checkpoint.setAttribute('material', 'color: rgb(102, 44, 9); side: double; emissive: orange; emissiveIntensity: 0.5');
        checkpoint.setAttribute('position', position);
        checkpoint.setAttribute('rotation', '-90 0 0');

        //Adding circlesXR highlights/hover effects to indicate clickability
        checkpoint.setAttribute('circles-interactive-object', 'type: highlight; highlight_color: rgb(255, 255, 0); hover_scale: 1.1; click_scale: 1.2; enabled: true');


        checkpoint.addEventListener('click', () => {
            // Teleport the player to the target position
            const playerEntity = document.querySelector('[camera]');
            playerEntity.setAttribute('position', targetPosition);
            console.log('Teleported to:', targetPosition);
        });
    
        const scene = document.querySelector('a-scene');
        scene.appendChild(checkpoint);
        //return checkpoint;
    }
    //Initialize permanent checkpoints (for baggage and cafe)
    initializeCheckpoints() {

        //From Seating to Cafe (done when unlocking door via door's switch statement) -->
        //this.createTeleportCheckpoint('0.95 0.327 -21.88', '0.018 1.6 -26.13');
        //From cafe to Seating <--
        this.createTeleportCheckpoint('0.95 0.327 -25.88', '0.018 1.6 -10.13');

        //From Cafe to Baggage  -->
        this.createTeleportCheckpoint('0.95 0.327 -64.83', '0.018 1.6 -60.13');  
        //From Baggage to Cafe <-- (just flip the last digits)
        this.createTeleportCheckpoint('0.95 0.327 -66.83', '0.018 1.6 -50.13');  

        //Add more when needed here

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
    constructor(position, htmlElementId, modelUrl, rewards, objModelUrl, mtlUrl,artifactSystem) {
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
        this.objModelUrl = objModelUrl; 
        this.mtlUrl = mtlUrl ;
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
        

        //Add the reward(s) to the inventory
        if (Array.isArray(this.rewards)) {
            this.rewards.forEach(reward => {
                this.artifactSystem.addToInventory(reward);
                this.artifactSystem.createOrUpdateUIText("Rewards Obtained: " + this.rewards.join(', '));
                //Refresh the UI to show remaining images in inventory 
                this.artifactSystem.createOrUpdateUIImage(); 
            });
        } else {
            //If there's only a single reward, add it directly
            this.artifactSystem.addToInventory(this.rewards);
            //Refresh the UI to show remaining images in inventory 
            this.artifactSystem.createOrUpdateUIImage(); 
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
            grabEntity.setAttribute('gltf-model', this.modelUrl);
            grabEntity.setAttribute('rotation', "0 60 0");
        }else if (this.objModelUrl && this.mtlUrl) {
            // Set the obj-model attribute using the OBJ and MTL files
            grabEntity.setAttribute('obj-model', `obj: url(${this.objModelUrl}); mtl: url(${this.mtlUrl})`);
        }else{
        grabEntity.setAttribute('geometry', `primitive: box; depth: 0.5; height: 0.5; width: 2`);
        grabEntity.setAttribute('material', 'color: red');
        }
        
        //Position
        grabEntity.setAttribute('position', `${this.position.x} ${this.position.y} ${this.position.z}`);
        
        //Adding circlesXR highlights/hover effects to indicate clickability
        grabEntity.setAttribute('circles-interactive-object', 'type: highlight; highlight_color: rgb(255, 255, 0); hover_scale: 1.1; click_scale: 1.2; enabled: true');


        //Adding listener for click/tap interaction
        grabEntity.addEventListener('click', () => {
            //Get positions
            const playerPosition = this.artifactSystem.gameSystem.playerPosition();
            const artifactPosition = new THREE.Vector3(this.position.x, this.position.y, this.position.z);
            
            //If in proximity and click is initiated, perform select
            if (this.artifactSystem.proximity(playerPosition, artifactPosition, 5)) {
                this.select();
            } else {
                console.log("Player is too far to interact with the grabbable.");
                this.artifactSystem.createOrUpdateUIText("Too far, move closer")
            }
        });

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
    constructor(position, htmlElementId, modelUrl, itemsToUnlock, reward, lockText, unlockText, objModelUrl, mtlUrl, artifactSystem) {
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
        this.objModelUrl = objModelUrl; 
        this.mtlUrl = mtlUrl;
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
            this.artifactSystem.createOrUpdateUIText(this.unlockText)
            //update inventory images in camera
            //Remove images that were required to unlock the artifact from camera (indicates they've been used)
            this.artifactSystem.removeUsedArtifactImages(this.itemsToUnlock);
            //Remove reward from inventory (to remove the item and disable UI updates on it)
            this.artifactSystem.removeFromInventory(this.itemsToUnlock);
            //Refresh the UI to show remaining images in inventory 
            this.artifactSystem.createOrUpdateUIImage();
            //Remove item itself from inventory
            this.artifactSystem.removeFromInventory(this.itemsToUnlock);

            //Executing specific actions based on the obstacle type
            switch (this.htmlElementId) {
                case 'door':
                    console.log('Generating circlesXR checkpoint...');
                    //update progress bar
                    this.artifactSystem.updateProgressBar();
                    //Generate circlesXR checkpoint 
                    //this.createTeleportCheckpoint('0.95 0.327 -21.88', '0.018 1.6 -26.13');

                    //update inventory images
                    //Remove images that were required to unlock the artifact from camera (indicates they've been used)
                    this.artifactSystem.removeUsedArtifactImages(this.itemsToUnlock);
                    break;
                case 'sewingMachine':
                    console.log('Giving digit code to players...');
                    //Add digit code to inventory
                    this.artifactSystem.addToInventory(this.reward);
                    console.log(`${this.reward} added to inventory.`);
                    this.artifactSystem.createOrUpdateUIImage();
                    //Remove items previously required to unlock the artifact from inventory (since they'r enow used)
                    this.artifactSystem.removeFromInventory(this.itemsToUnlock); 
                    //Update Progress Bar
                    this.artifactSystem.updateProgressBar();
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
            this.artifactSystem.createOrUpdateUIText(this.lockText)
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
            obEntity.setAttribute('gltf-model', this.modelUrl);
        } else if (this.objModelUrl && this.mtlUrl) {
            //Set the obj-model attribute using the OBJ and MTL files
            obEntity.setAttribute('obj-model', `obj: url(${this.objModelUrl}); mtl: url(${this.mtlUrl})`);
        }else{
            obEntity.setAttribute('geometry', `primitive: box; depth: 0.5; height: 3; width: 2`);
            obEntity.setAttribute('material', 'color: blue');
        }
        
        //Position
        obEntity.setAttribute('position', `${this.position.x} ${this.position.y} ${this.position.z}`);
        
        //Id mapping
        obEntity.setAttribute('id', this.htmlElementId);

        //Adding circlesXR clickable/hover effects
        obEntity.setAttribute('circles-interactive-object', 'type: outline; hover_scale: 1.05; click_scale: 1.1; enabled: true');

        
        //Add click event listener for click/tap interactions
        obEntity.addEventListener('click', () => {
            //Get positions
            const playerPosition = this.artifactSystem.gameSystem.playerPosition();
            const artifactPosition = new THREE.Vector3(this.position.x, this.position.y, this.position.z);
            
            //If in proximity and click is initiated, perform select
            if (this.artifactSystem.proximity(playerPosition, artifactPosition, 5)) {
                this.select();
            } else {
                console.log("Player is too far to interact with the obstacle.");
                this.artifactSystem.createOrUpdateUIText("Too far, move closer")
            }
        });

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
    constructor(digitCount, position, htmlElementId, modelUrl, passcode, rewards, newModelUrl, objModelUrl, mtlUrl , newObjModelUrl, newMtlUrl, artifactSystem) {
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
        this.objModelUrl = objModelUrl;
        this.mtlUrl = mtlUrl;
        //unlock
        this.newObjModelUrl = newObjModelUrl; 
        this.newMtlUrl = newMtlUrl;
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
       
        //If gltf use it
        if (this.modelUrl) {
            suitcaseEntity.setAttribute('gltf-model', this.modelUrl);
            
            //if obj use it
        } else if (this.objModelUrl && this.mtlUrl) {
            //Set the obj-model attribute using the OBJ and MTL files
            suitcaseEntity.setAttribute('obj-model', `obj: url(${this.objModelUrl}); mtl: url(${this.mtlUrl})`);
            //Create default/placeholders
        }else{
        //Sets the width based on how many locks there are (3 locks = medium width, 6 locks = large width, etc)
        suitcaseEntity.setAttribute('geometry', `primitive: box; depth: 0.5; height: 0.5; width: ${this.digitCount * 0.5}`);
        //Muted brown
        suitcaseEntity.setAttribute('material', 'color: #652A1D');
        }
        //Position suitcase
        suitcaseEntity.setAttribute('position', `${this.position.x} ${this.position.y} ${this.position.z}`);
        
        
        //Scaling whole object
        suitcaseEntity.setAttribute('scale', "0.6 0.6 0.6");
        
        
        //Rotating whole object
        //Apply rotation based on suitcase ID
        if (this.htmlElementId === 'suitcase-1') {
            suitcaseEntity.setAttribute('rotation', '0 -68 0'); 
        } else if (this.htmlElementId === 'suitcase-2') {
            suitcaseEntity.setAttribute('rotation', '0 68 0'); 
        } else {
            //Default rotation
            suitcaseEntity.setAttribute('rotation', '0 0 0');
        }

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
        //Increment progress Bar
        if (unlocked) {
            console.log("Suitcase unlocked!");
            this.artifactSystem.createOrUpdateUIText("Suitcase unlocked!")
            //update progress bar
            this.artifactSystem.updateProgressBar();
            
            //Loop over the rewards array, and add the string into the inventory (and display image to camera)
            this.rewards.forEach(reward => {
                this.artifactSystem.addToInventory(reward);
                console.log("Reward Obtained: ", this.reward);
                this.artifactSystem.createOrUpdateUIText("Rewards Obtained: " + this.rewards.join(', '));
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
        } else if (this.newObjModelUrl && this.newMtlUrl) {
            //Set the obj-model attribute using the OBJ and MTL files
            unlockedEntity.setAttribute('obj-model', `obj: url(${this.newObjModelUrl}); mtl: url(${this.newMtlUrl})`);
        }else {
            unlockedEntity.setAttribute('geometry', 'primitive: box; depth: 0.5; height: 0.5; width: 1');
            unlockedEntity.setAttribute('material', 'color: green'); // Indicate unlocked
        }
        unlockedEntity.setAttribute('position', this.position);
        //Setting the same ID as the locked entity to maintain reference
        unlockedEntity.setAttribute('id', this.htmlElementId);
        const scene = document.querySelector('a-scene');
        
        //Scaling whole object
        unlockedEntity.setAttribute('scale', "0.6 0.6 0.6");
        //Rotating whole object
        //Apply rotation based on suitcase ID
        if (this.htmlElementId === 'suitcase-1') {
            unlockedEntity.setAttribute('rotation', '0 -68 0'); 
            this.artifactSystem.createOrUpdateUIImage();
        } else if (this.htmlElementId === 'suitcase-2') {
            unlockedEntity.setAttribute('rotation', '0 68 0'); 
            this.artifactSystem.removeImageForArtifact(this.htmlElementId);
            //Remove coded paper from inventory
            this.artifactSystem.removeFromInventory(this.itemsToUnlock);
            this.artifactSystem.removeFromInventory(['otherFabric']);
        } else {
            //Default rotation
            unlockedEntity.setAttribute('rotation', '0 0 0');
        }

        scene.appendChild(unlockedEntity);
    }

}

//CLOCK
//Can manipulate digits within the clock (hour and minute) 
//Contains only increment (clockwise) and decrement (counter clockwise) interactions
class Clock extends Artifact{
    constructor(position, htmlElementId, passcode, rewards, lockText, unlockText, itemsToUnlock, faceModelUrl,handlesModelUrl, newFaceModelUrl, objModelUrl, mtlUrl, faceObjModelUrl, faceMtlUrl, newObjModelUrl, newMtlUrl,artifactSystem) {
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
        //Handles
        this.objModelUrl = objModelUrl;
        this.mtlUrl = mtlUrl;
        this.faceObjModelUrl = faceObjModelUrl; 
        this.faceMtlUrl = faceMtlUrl;
        //unlock face
        this.newObjModelUrl = newObjModelUrl; 
        this.newMtlUrl = newMtlUrl;
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
            this.artifactSystem.createOrUpdateUIText(this.unlockText);
        
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
        }else if (this.faceObjModelUrl && this.faceMtlUrl) {
            //Set the obj-model attribute using the OBJ and MTL files
            clockEntity.setAttribute('obj-model', `obj: url(${this.faceObjModelUrl}); mtl: url(${this.faceMtlUrl})`);
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
        // Wide Decrement Button
        const clockDecButton = document.createElement('a-entity');
        clockDecButton.setAttribute('circles-button', `type: box; button_color: rgb(0,255,0); button_color_hover: rgb(180,255,180); pedestal_color: rgb(255,255,0); width: 1.0; height: 0.2; depth: 0.1`);
        clockDecButton.setAttribute('scale', "1 0.1 1");
        clockDecButton.setAttribute('rotation', "90 0 0");
        clockDecButton.setAttribute('position', "0.5 -0.8 0.05"); 
        clockDecButton.addEventListener('click', () => {
            this.decrement();
            //Check if Input matches Passcode
            this.checkUnlock();
        });
        clockEntity.appendChild(clockDecButton);

        //Wide Increment Button
        const clockIncButton = document.createElement('a-entity');
        clockIncButton.setAttribute('circles-button', `type: box; button_color: rgb(255,0,0); button_color_hover: rgb(255,180,180); pedestal_color: rgb(255,255,0); width: 1.0; height: 0.2; depth: 0.1`);
        clockIncButton.setAttribute('scale', "1 0.1 1");
        clockIncButton.setAttribute('rotation', "90 0 0");
        clockIncButton.setAttribute('position', "-0.5 -0.8 0.05"); 
        clockIncButton.addEventListener('click', () => {
            this.increment();
            //Check if Input matches Passcode
            this.checkUnlock();
        });
        clockEntity.appendChild(clockIncButton);

        //Select Button Text
        const buttonText = document.createElement('a-text');
        buttonText.setAttribute('value', this.types[this.currentTypeIndex].toUpperCase());
        buttonText.setAttribute('align', 'center');
        buttonText.setAttribute('color', '#000');
        //Position will be set relative to the selectButton later
        buttonText.setAttribute('position', '0 -0.5 0.3'); 

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

        //Scaling whole object
        clockEntity.setAttribute('scale', "0.3 0.3 0.3");
        clockEntity.setAttribute('rotation', "0 -26.6 0");
        
        
        //Append the clock entity to the scene in either case
        document.querySelector('a-scene').appendChild(clockEntity);
    }

    //Creates a cylinder for hands and corresponding Id for selection
    generateHand(clockEntity, type, rotation) {
        
        const clockHand = document.createElement('a-entity');
        if (this.handlesModelUrl) {
            //Use GLTF model for hands
            clockHand.setAttribute('gltf-model', this.handlesModelUrl);
            //Scale down for the hour hand
            clockHand.setAttribute('scale', type === 'hour' ? "0.6 0.6 0.6" : "0.8 0.8 0.8");
            clockHand.setAttribute('position', `0 0.5 0.33`);
        } else if (this.objModelUrl && this.mtlUrl) {
            //Set the obj-model attribute using the OBJ and MTL files
            clockHand.setAttribute('obj-model', `obj: url(${this.objModelUrl}); mtl: url(${this.mtlUrl})`);
            clockHand.setAttribute('scale', type === 'hour' ? "0.4 0.4 0.4" : "0.6 0.6 0.6");
        }else{
            //For height if handle is "hour"-type give short height, otherwise set height to be longer for minute
            clockHand.setAttribute('geometry', {primitive: 'cylinder', height: type === 'hour' ? 0.1 : 0.15, radius: 0.01});
            //if hour make it orange, if minute make it blue (for easier differentiation)
            clockHand.setAttribute('material', 'color', type === 'hour' ? '#E17E0F' : '#0F25E1');
            
            
            //Position and Rotations, having minute be pointing rightwards (90 degrees)? initially for easy viewing
            //Afterwards rotation increments/decrements normally
            if (type === 'minute') {
                clockHand.setAttribute('position', '-0.07 0.5 0.9');
                clockHand.setAttribute('rotation', `0 0 ${rotation}`);
            } else {
                clockHand.setAttribute('position', '0 0.5 0.9');
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
            this.artifactSystem.createOrUpdateUIText("Clock unlocked!")
            //Remove images that were required to unlock the artifact from camera (in this case coded papers) to indicate they've been used
            this.artifactSystem.removeImageForArtifact(this.htmlElementId);

            //Remove coded papers from inventory (passing the item name directly since other methods (passing itemsToUnlock list and Rewards list) didn't work)
            this.artifactSystem.removeFromInventory(['paper']);

            //Update Progress Bar
            this.artifactSystem.updateProgressBar();

            
            //Loop over the rewards array and add the string into the inventory 
            this.rewards.forEach(reward => {
                this.artifactSystem.addToInventory(reward);
                console.log("Reward Obtained: ", this.reward);
                this.artifactSystem.createOrUpdateUIText("Rewards Obtained: " + this.rewards.join(', '));
                this.artifactSystem.createOrUpdateUIImage();
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
            
            //Scaling whole object
            clockEntity.setAttribute('scale', "0.3 0.3 0.3");
            clockEntity.setAttribute('rotation', "0 -26.6 0");
            
        } else if (this.newObjModelUrl && this.newMtlUrl) {
            //Set the obj-model attribute using the OBJ and MTL files
            clockEntity.setAttribute('obj-model', `obj: url(${this.newObjModelUrl}); mtl: url(${this.newMtlUrl})`);
        }else {
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

