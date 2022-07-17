import React, { useState, useContext, createContext, useEffect } from "react";
import styles from './css'
import { evalWinner, findLowestRow, genGrid, turnText } from './logic'

const ConnectFourContext = createContext();

// render an individual cell on the board
const RenderSquare = ({ info }) => {
  const { boardState, setState } = useContext(ConnectFourContext);
  // destructure info for cell's respective column indexes
  const { columnIdx, rowIdx } = info;
  // get current state of the board
  const { board } = boardState;
  // get cell value whether that be red/yellow/null
  const arrCell = board[rowIdx][columnIdx];
  // handler function for clicking within cell's circle
  const clickCirc = () => {
    // freeze the game if a winner is declared until reset is clicked
    if (boardState.winner) {
      return;
    }
    /* no matter which row is clicked on, place token in minimum
    available row position for that column */
    const row = findLowestRow(board, columnIdx);
    /* row will be null if there are no available rows left in that column
    to place the token. Turns do not change until player picks a valid
    column to place their token*/
    if (row === null) {
      return;
    }
    // overwrite our cell's value with current player's color
    board[row][columnIdx] = boardState.turn;
    /* before we write our modified board to state, let's evaluate
    it to determine if we have a winner first */
    const winner = evalWinner(board, boardState.turn);

    let nextTurn = undefined
    // if winner either yellow or red set turn to that value
    if (winner) {
      nextTurn = winner
    } else {
      // if no winner invert the turn value from red/yellow or yellow/red
      nextTurn = boardState.turn === 'yellow' ? 'red' : 'yellow'
    }
    setState({
      ...boardState,
      board: board,
      turn: nextTurn,
      winner,
    });
  };

  // render interactive circle within square cell
  return (
    <div style={{ backgroundColor: "blue", ...styles.padInner }}>
      <div
        onClick={clickCirc}
        style={{
          // default circle color is white
          backgroundColor: "white",
          ...styles.dot,
          // if cell content isn't null then color it by it's val
          ...(arrCell === "yellow" ? { backgroundColor: arrCell } : {}),
          ...(arrCell === "red" ? { backgroundColor: arrCell } : {}),
        }}
      ></div>
    </div>
  );
};

// render board and some header text describing the game's state
const RenderBoard = () => {
  const { boardState } = useContext(ConnectFourContext);
  const { board } = boardState;

// map cells according to our 2d array board, iterate by row
  const cells = board.map((iter, rowIdx) => {
    // iterate individual cells within row
    const inner = iter.map((inner_iter, columnIdx) => {
      // render cell and pass it the indexes
      return <RenderSquare info={{ rowIdx, columnIdx }} />;
    });
    // render rows with individual cells as children
    return <div style={styles.row}>{inner}</div>;
  });

  return (
    // render outer container
    <div style={{ ...styles.board }}>
      <h1
        style={{
          // color text according to who's turn it is
          ...(boardState.turn === "yellow" ? { color: boardState.turn } : {}),
          ...(boardState.turn === "red" ? { color: boardState.turn } : {}),
          // outline text with shadow so yellow is readable against white bg
          ...styles.shadowFont
        }}
      >
      {/* render our information text */}
        {turnText(boardState)}
      </h1>
      {/* render our rows of cells hiararchy */}
      {cells}
    </div>
  );
};

// Connect Four game parent component
const ConnectFour = () => {
  const [boardState, setState] = useState({ loading: true });
  // reset brings our state data back to default
  const reset = () => {
    setState({
      board: genGrid(),
      loading: false,
      turn: "red",
      winner: null,
    });
  };
  // initialize our app on start by calling reset once
  useEffect(() => {
    reset();
  }, []);
  // don't render until state is initialized or crash
  if (boardState.loading) {
    return <div>Loading</div>;
  }
  return (
    <ConnectFourContext.Provider value={{ boardState, setState }}>
      <div style={styles.outer}>
        <h1>Connect Four</h1>
        {/* reset button returns state to initial value*/}
        <button onClick={reset} style={styles.reset}>
          RESET
        </button>
        <RenderBoard />
      </div>
    </ConnectFourContext.Provider>
  );
};

export default ConnectFour;
