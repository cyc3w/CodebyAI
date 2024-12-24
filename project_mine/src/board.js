export function createBoard(size, minesCount) {
  const cells = Array(size).fill().map(() => 
    Array(size).fill().map(() => ({
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      adjacentMines: 0
    }))
  );

  // Place mines randomly
  let remainingMines = minesCount;
  while (remainingMines > 0) {
    const x = Math.floor(Math.random() * size);
    const y = Math.floor(Math.random() * size);
    
    if (!cells[y][x].isMine) {
      cells[y][x].isMine = true;
      remainingMines--;
    }
  }

  // Calculate adjacent mines
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (!cells[y][x].isMine) {
        cells[y][x].adjacentMines = countAdjacentMines(cells, x, y, size);
      }
    }
  }

  return {
    cells,
    
    toggleFlag(x, y) {
      if (!cells[y][x].isRevealed) {
        cells[y][x].isFlagged = !cells[y][x].isFlagged;
      }
    },
    
    reveal(x, y) {
      if (cells[y][x].isFlagged || cells[y][x].isRevealed) return;
      
      cells[y][x].isRevealed = true;
      
      if (cells[y][x].isMine) {
        return 'mine';
      }
      
      if (cells[y][x].adjacentMines === 0) {
        revealAdjacentCells(cells, x, y, size);
      }
      
      if (checkWin(cells)) {
        return 'win';
      }
    },
    
    revealAll() {
      cells.forEach(row => row.forEach(cell => cell.isRevealed = true));
    }
  };
}

function countAdjacentMines(cells, x, y, size) {
  let count = 0;
  
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const newX = x + dx;
      const newY = y + dy;
      
      if (newX >= 0 && newX < size && newY >= 0 && newY < size) {
        if (cells[newY][newX].isMine) count++;
      }
    }
  }
  
  return count;
}

function revealAdjacentCells(cells, x, y, size) {
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const newX = x + dx;
      const newY = y + dy;
      
      if (newX >= 0 && newX < size && newY >= 0 && newY < size) {
        const cell = cells[newY][newX];
        if (!cell.isRevealed && !cell.isMine && !cell.isFlagged) {
          cell.isRevealed = true;
          if (cell.adjacentMines === 0) {
            revealAdjacentCells(cells, newX, newY, size);
          }
        }
      }
    }
  }
}

function checkWin(cells) {
  return cells.every(row => 
    row.every(cell => 
      cell.isRevealed === !cell.isMine
    )
  );
}