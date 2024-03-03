//GAMELOOP - Initializes the GameSystem
import { GameSystem } from './gameSystem.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    const gameSystem = new GameSystem();
    console.log('GameSystem instantiated successfully');
});