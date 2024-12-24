import { createBoard } from './board.js';
import { Timer } from './timer.js';

const BOARD_SIZE = 9;
const MINES_COUNT = 10;

let board;
let timer;
let gameOver = false;

function initGame() {
  gameOver = false;
  document.getElementById('new-game').textContent = '😊';
  document.getElementById('mines-count').textContent = MINES_COUNT;
  
  if (timer) timer.stop();
  timer = new Timer(document.getElementById('timer'));
  
  board = createBoard(BOARD_SIZE, MINES_COUNT);
  renderBoard();
}

function renderBoard() {
  const boardElement = document.getElementById('board');
  boardElement.innerHTML = '';

  board.cells.forEach((row, y) => {
    row.forEach((cell, x) => {
      const cellElement = document.createElement('button');
      cellElement.className = 'cell';
      cellElement.dataset.x = x;
      cellElement.dataset.y = y;
      
      if (cell.isRevealed) {
        cellElement.classList.add('revealed');
        if (cell.isMine) {
          cellElement.textContent = '💣';
          cellElement.classList.add('mine');
        } else if (cell.adjacentMines > 0) {
          cellElement.textContent = cell.adjacentMines;
        }
      } else if (cell.isFlagged) {
        cellElement.textContent = '🚩';
        cellElement.classList.add('flagged');
      }
      
      boardElement.appendChild(cellElement);
    });
  });
}

function handleCellClick(event) {
  if (gameOver) return;
  
  const cell = event.target;
  if (!cell.classList.contains('cell')) return;
  
  const x = parseInt(cell.dataset.x);
  const y = parseInt(cell.dataset.y);
  
  if (!timer.isRunning) timer.start();
  
  if (event.button === 2 || event.ctrlKey) { // Right click or Ctrl+click
    board.toggleFlag(x, y);
    document.getElementById('mines-count').textContent = 
      MINES_COUNT - board.cells.flat().filter(cell => cell.isFlagged).length;
  } else { // Left click
    const result = board.reveal(x, y);
    
    if (result === 'mine') {
      gameOver = true;
      timer.stop();
      document.getElementById('new-game').textContent = '😵';
      board.revealAll();
    } else if (result === 'win') {
      gameOver = true;
      timer.stop();
      document.getElementById('new-game').textContent = '😎';
    }
  }
  
  renderBoard();
}

// Event Listeners
document.getElementById('board').addEventListener('click', handleCellClick);
document.getElementById('board').addEventListener('contextmenu', (e) => {
  e.preventDefault();
  handleCellClick(e);
});
document.getElementById('new-game').addEventListener('click', initGame);

// Prevent context menu on right click
document.addEventListener('contextmenu', e => e.preventDefault());

// Initialize game
initGame();