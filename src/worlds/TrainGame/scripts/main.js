//GAMELOOP - Initializes the GameSystem

import { GameSystem } from '../scripts/gameSystem/gameSystem.js';

document.addEventListener('DOMContentLoaded', () => {
    const gameSystem = new GameSystem();
    gameSystem.initialize();

    //Looping or requesting animation frames here
    //Hidden for now for reference, will update later
    // function gameLoop() {
    //     requestAnimationFrame(gameLoop);
    //     // Calculate deltaTime if necessary
    //     gameSystem.update(deltaTime);
    // }
    // gameLoop();
});