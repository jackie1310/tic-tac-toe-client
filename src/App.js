import logo from './logo.svg';
import './App.css';
import { Fragment, useEffect, useState } from 'react';

function App() {
  const [board, setBoard] = useState([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ]);
  const [player, setPlayer] = useState("X");
  const [status, setStatus] = useState("Game continues");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (player === "O" && status === "Game continues") {
      makeAIMove()
    }
  }, [player, status]);

  useEffect(() => {
    checkGameStatus()
  }, [board])

  const makeAIMove = () => {
    setLoading(true);
    fetch(`http://localhost:8080/api/game?board=${encodeURIComponent(
      JSON.stringify(board)
    )}`).then((res) => res.json())
    .then((data) => {
      // console.log(data);
      console.log(data.row, data.col);
      board[data.row][data.col] = 'O';
      setBoard([...board]);
      setPlayer('X');
      setLoading(false);
    })
  }

  const checkGameStatus = () => {
    // Check rows
    for (let i = 0; i < 3; i++) {
      if (
        board[i][0] === board[i][1] &&
        board[i][1] === board[i][2] &&
        board[i][0] !== ""
      ) {
        setStatus(`${board[i][0]} wins`);
        return;
      }
    }

    // Check columns
    for (let i = 0; i < 3; i++) {
      if (
        board[0][i] === board[1][i] &&
        board[1][i] === board[2][i] &&
        board[0][i] !== ""
      ) {
        setStatus(`${board[0][i]} wins`);
        return;
      }
    }

    // Check diagonals
    if (
      board[0][0] === board[1][1] &&
      board[1][1] === board[2][2] &&
      board[0][0] !== ""
    ) {
      setStatus(`${board[0][0]} wins`);
      return;
    }

    if (
      board[0][2] === board[1][1] &&
      board[1][1] === board[2][0] &&
      board[0][2] !== ""
    ) {
      setStatus(`${board[0][2]} wins`);
      return;
    }

    // Check for a tie
    let isBoardFull = true;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === "") {
          isBoardFull = false;
          break;
        }
      }
    }

    if (isBoardFull) {
      setStatus("It's a tie");
      return;
    }

    // If no win or tie, the game continues
    setStatus("Game continues");
  };

  const handleCellClick = (row, col) => {
    if (board[row][col] === "" && player === "X" && status === "Game continues") {
      board[row][col] = "X";
      setBoard([...board]);
      setPlayer("O")
    }
  }
  // const checkGameStatus = (board) => {
  //   // Check rows, columns, and diagonals for a win
  //   for (let i = 0; i < 3; i++) {
  //     if (board[i][0] === board[i][1] && board[i][1] === board[i][2] && board[i][0] !== "") {
  //       return `${board[i][0]} wins`;
  //     }
  //     if (board[0][i] === board[1][i] && board[1][i] === board[2][i] && board[0][i] !== "") {
  //       return `${board[0][i]} wins`;
  //     }
  //   }
  //   if (board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[0][0] !== "") {
  //     return `${board[0][0]} wins`;
  //   }
  //   if (board[0][2] === board[1][1] && board[1][1] === board[2][0] && board[0][2] !== "") {
  //     return `${board[0][2]} wins`;
  //   }

  //   // Check for a tie
  //   if (board.flat().every((cell) => cell !== "")) {
  //     return "It's a tie";
  //   }

  //   return "Game continues";
  // };

  // const handleClick = async (row, col) => {
  //   if (board[row][col] !== "" || status !== "Game continues") return;

  //   const newBoard = board.map((r, rIndex) =>
  //     r.map((c, cIndex) => (rIndex === row && cIndex === col ? player : c))
  //   );
  //   setBoard(newBoard);
  //   const gameStatus = checkGameStatus(newBoard);

  //   if (gameStatus !== "Game continues") {
  //     setStatus(gameStatus);
  //   } else {
  //     setPlayer("O");
  //     const aiMove = await getAiMove(newBoard);
  //     if (aiMove) {
  //       newBoard[aiMove.row][aiMove.col] = "O";
  //       setBoard(newBoard);
  //       const newStatus = checkGameStatus(newBoard);
  //       setStatus(newStatus);
  //       setPlayer("X");
  //     }
  //   }
  // };


  const renderCell = (row, col) => {
    return (
      <button className="custom-button" disabled={loading || status !== 'Game continues'} onClick={() => handleCellClick(row, col)}>{board[row][col]}</button>
    )
  }

  return (
    <div className="App">
      <h1 className='title'>Tic Tac Toe</h1>
      <div className='board'>
        {board.map((row, i) => (
          <div className='row'>
            {row.map((_, j) => (
              <Fragment key={j}>{renderCell(i, j)}</Fragment>
            ))}
          </div>
        ))}
      </div>
      <div className={`${status === "Game continues" ? "status": "status-win"}`}>{status}</div>
    </div>
  );
}

export default App;
