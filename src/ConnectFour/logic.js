// thise file contains only pure functions of helper lgoic

// returns the winner (either red/yellow) if one is determined
const evalWinner = (table, turn) => {
  // table is a 2d array representing our board, turn is yellow/red
  const evalDiag = (row, cell, pos, pos2) => {
    /* row, cell represent coordinates of single element in our board
    pos, pos2 are modifiers to the coordinates that are checked adjacent
    to row, cell. This allows us to check vertically, horizontally, and
    diagonally left and right. Answers are only checked in one direction ie
    only right-left, top-bottom */
    let one = null;
    let two = null;
    let three = null;
    // if any of the cells check doesn't exist, we will get an exception
    try {
      // check 3 positions adjacent to row, cell
      one = table[row + 1 * pos][cell + 1 * pos2];
      two = table[row + 2 * pos][cell + 2 * pos2];
      three = table[row + 3 * pos][cell + 3 * pos2];
    } catch {
      // fail, auto fail this evaluation
      return false;
    }
    // if all the cells are equal and not null
    if (one === turn && two === turn && three === turn && one != null) {
      return true;
    }
    // if we haven't returned by now, return false
    return false;
  };
  // run our evalDiag function on every cell matching our turn
  const evalCols = () => {
    let win = false;
    // we can use a nested loop here because we're traversing a 2d array
    for (let i = 0; i < table.length; i++) {
      const row = table[i];
      for (let x = 0; x < row.length; x++) {
        const cell = row[x];
        if (cell === turn && !win) {
          win =
            //check vertical
            evalDiag(i, x, -1, 0) ||
            // check horizontal
            evalDiag(i, x, 0, -1) ||
            // check left to right diagonal
            evalDiag(i, x, 1, 1) ||
            // check right to left diagonal
            evalDiag(i, x, 1, -1);
        }
      }
    }
    // win is true if any of the evalDiag calls returned true
    return win;
  };
  // run evaluate
  const win = evalCols();
  // if win return current turn else return null
  return win ? turn : null;
};
/* Function scans the row indices of our 2d array for a given column and
returns the index of that row */
const findLowestRow = (table, column) => {
  let highestIndex = null;
  for (let i = 0; i < table.length; i++) {
    const cell = table[i][column];
    if (cell === null) {
      if (highestIndex === null || highestIndex < i) {
        highestIndex = i;
      }
    }
  }
  return highestIndex;
};
// This function initializes our 2d array for our board
const genGrid = () => {
  const rows = [];
  for (let i = 0; i < 7; i++) {
    const row = [null, null, null, null, null, null, null];
    rows.push(row);
  }
  return rows;
};
// Generates the contnents for our turn/win text
const turnText = (boardState) => {
  const text = (boardState.turn === "yellow" ? "Yellow's" : "Red's") + " turn";
  const winner =
    "Connect Four! " +
    (boardState.winner === "yellow" ? "Yellow" : "Red") +
    " wins!";
  return boardState.winner ? winner : text;
};

export { findLowestRow, evalWinner, genGrid, turnText };
