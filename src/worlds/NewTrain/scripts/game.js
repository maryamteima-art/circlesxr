//GAMELOOP - Initializes the GameSystem
import { GameSystem } from './gameSystem.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');
    const scene = document.querySelector('a-scene');
        scene.addEventListener('loaded', function () {
            console.log("SCENE Loaded");
            const gameSystem = new GameSystem();
            gameSystem.initialize();
            console.log('GameSystem instantiated successfully');
        });
});