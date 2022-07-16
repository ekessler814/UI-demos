import React, { useState, useContext, createContext, useEffect } from "react";

const styles = {
  board: {
    border: "10px solid grey",
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    width: "800px",
    height: "800px",
  },
  padInner: {
    alignSelf: "stretch",
    flex: "1 1 auto",
    flexBasis: "auto",
    padding: "10px",
    alignItems: "stretch",
    border: "2px solid white",
  },
  row: {
    alignSelf: "stretch",
    flex: "1 1 auto",
    display: "flex",
    flexDirection: "row",
  },
  outer: {
    paddingLeft: "10px",
    display: "flex",
    flexDirection: "column",
  },
  dot: {
    height: "100%",
    width: "100%",
    border: "1px solid grey",
    borderRadius: "50%",
    display: "inline-block",
    cursor: "pointer",
  },
  reset: {
    width: "100px",
    height: "25px",
    marginBottom: "10px",
  },
};

const genGrid = () => {
  const rows = [];
  for (let i = 0; i < 7; i++) {
    const row = [null, null, null, null, null, null, null];
    rows.push(row);
  }
  return rows;
};

const ConnectFourContext = createContext();

const evalWinner = (table, turn) => {
  const evalDiag = (row, cell, pos, pos2) => {
    let one = null;
    let two = null;
    let three = null;
    try {
      one = table[row + 1 * pos][cell + 1 * pos2];
      two = table[row + 2 * pos][cell + 2 * pos2];
      three = table[row + 3 * pos][cell + 3 * pos2];
    } catch {
      return false;
    }
    if (one === turn && two === turn && three === turn && one != null) {
      return true;
    }
    return false
  };

  const evalCols = () => {
    let win = false;
    for (let i = 0; i < table.length; i++) {
      const row = table[i];
      for (let x = 0; x < row.length; x++) {
        const cell = row[x];
        if (cell === turn && !win) {
          win =
            evalDiag(i, x, -1, 0) ||
            evalDiag(i, x, 1, 1) ||
            evalDiag(i, x, 1, -1) ||
            evalDiag(i, x, 0, -1);
        }
      }
    }
    return win;
  };
  const win = evalCols();
  return win ? turn : null;
};

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

const RenderSquare = ({ info }) => {
  const { columnIdx, rowIdx } = info;
  const { boardState, setState } = useContext(ConnectFourContext);
  const { board } = boardState;
  const arrCell = board[rowIdx][columnIdx];

  const clickCirc = () => {
    if (boardState.winner) {
      return;
    }

    const row = findLowestRow(board, columnIdx);

    if (row === null) {
      return;
    }

    board[row][columnIdx] = boardState.turn;
    const winner = evalWinner(board, boardState.turn);

    setState({
      ...boardState,
      board: board,
      turn: winner
        ? boardState.turn
        : boardState.turn === "yellow"
        ? "red"
        : "yellow",
      winner,
    });
  };

  return (
    <div style={{ backgroundColor: "blue", ...styles.padInner }}>
      <div
        onClick={clickCirc}
        style={{
          backgroundColor: "white",
          ...styles.dot,
          ...(arrCell === "yellow" ? { backgroundColor: "yellow" } : {}),
          ...(arrCell === "red" ? { backgroundColor: "red" } : {}),
        }}
      ></div>
    </div>
  );
};

const RenderBoard = () => {
  const { boardState } = useContext(ConnectFourContext);
  const { board } = boardState;

  const cells = board.map((iter, rowIdx) => {
    const inner = iter.map((inner_iter, columnIdx) => {
      return <RenderSquare info={{ rowIdx, columnIdx }} />;
    });

    return <div style={styles.row}>{inner}</div>;
  });

  const turnText = () => {
    const text =
      (boardState.turn === "yellow" ? "Yellow's" : "Red's") + " turn";
    const winner = "Connect Four! " +
      (boardState.winner === "yellow" ? "Yellow" : "Red") + " wins!";
    return boardState.winner ? winner : text;
  };
  return (
    <div style={{ ...styles.board }}>
      <h1
        style={{
          ...(boardState.turn === "yellow" ? { color: "yellow" } : {}),
          ...(boardState.turn === "red" ? { color: "red" } : {}),
          textShadow: "#000 0px 0px 3px",
          fontSize: "30px",
        }}
      >
        {turnText()}
      </h1>
      {cells}
    </div>
  );
};

const ConnectFour = () => {
  const [boardState, setState] = useState({ loading: true });

  const reset = () => {
    setState({
      board: genGrid(),
      loading: false,
      turn: "red",
      winner: null,
    });
  };

  useEffect(() => {
    reset();
  }, []);

  if (boardState.loading) {
    return <div>Loading</div>;
  }

  return (
    <ConnectFourContext.Provider value={{ boardState, setState }}>
      <div style={styles.outer}>
        <h1>Connect Four</h1>
        <button onClick={reset} style={styles.reset}>
          RESET
        </button>
        <RenderBoard />
      </div>
    </ConnectFourContext.Provider>
  );
};

export default ConnectFour;
