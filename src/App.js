import React, { useState } from 'react';

import { Segment, Button } from 'semantic-ui-react';

import Board from './components/Board'
import SaveModal from './components/SaveModal';
import GameList from './components/GameList'
import { USER_SYMBOL, COMPUTER_SYMBOL } from './const';
import { translateBoard } from './utils'
import tictactoe from './api/tictactoe';

function App() {

  const initialBoard = {
    boardSize: 3,
    boardName: "",
    usersCells: [],
    computersCells: []
  }

  const [board, setBoard] = useState(initialBoard)
  const [game, setGame] = useState({ message: "", isOver: false, started: false });
  const [gameListVisible, setGameListVisible] = useState(false);

  const handleClick = (row, col) => {
    if (!game.started) {
      setGame({...game, started: true});
    }
    makeTurn(row, col)
  }

  const handleReset = () => {
    setGame({ message: "", isOver: false, started: false});
    setBoard(initialBoard);
  }

  const handleListGames = () => {
    setGameListVisible(true);
  }

  const handleLoadGame = (id) => {
    tictactoe.get(`/boards/${id}`)
      .then(response => {
        const { data } = response;
        setGameListVisible(false);
        setGame( {message: "", isOver: false, started: false});
        setBoard( {boardSize: data.boardSize, boardName: data.boardName, usersCells: data.usersCells, computersCells: data.computersCells } )
        
      })
      .catch(error => {
        console.log(error);
      })
  }

  const makeTurn = (row, col) => {
    if (!findUsersCell(row, col) && !findComputersCell(row, col) && !game.isOver) {
      let usersCell = {row, col}
      let computersCell = {};
      let computerCellFound = false;
      const boardData = translateBoard(board);
      boardData[row][col] = USER_SYMBOL;
      for (let i = 0; i < board.boardSize && !computerCellFound; i++) {
        for (let j = 0; j < board.boardSize && !computerCellFound; j++) {
          if (!boardData[i][j] ) {
            computersCell = { row: i, col: j }
            computerCellFound = true;
          }
        }
      }
      if (computerCellFound) {
        setBoard({...board, usersCells: board.usersCells.concat(usersCell), computersCells: board.computersCells.concat(computersCell)})
      } else {
        setBoard({...board, usersCells: board.usersCells.concat(usersCell)})
        setGame({...game, message: "draw", isOver: true});
      }
        checkForWinner(usersCell, computersCell);
    }

  }

  const findUsersCell = (row, col) => {
    return board.usersCells.find(i => {
        return i.row === row && i.col === col
    })
  }

  const findComputersCell = (row, col) => {
    return board.computersCells.find(i => {
      return i.row === row && i.col === col
    })
  }

  const checkForWinner = (usersCell, computersCell) => {
    const boardData = translateBoard(board);
    boardData[usersCell.row][usersCell.col] = USER_SYMBOL;
    if (!Object.keys(computersCell).length === 0) {
      boardData[computersCell.row][computersCell.col] = COMPUTER_SYMBOL;
    }
    
    const lines = [
      [{ r: 0, c: 0 }, { r: 0, c: 1}, { r: 0, c: 2}],
      [{ r: 1, c: 0 }, { r: 1, c: 1}, { r: 1, c: 2}],
      [{ r: 2, c: 0 }, { r: 2, c: 1}, { r: 2, c: 2}],
      [{ r: 0, c: 0 }, { r: 1, c: 0}, { r: 2, c: 0}],
      [{ r: 0, c: 1 }, { r: 1, c: 1}, { r: 2, c: 1}],
      [{ r: 0, c: 2 }, { r: 1, c: 2}, { r: 2, c: 2}],
      [{ r: 0, c: 0 }, { r: 1, c: 1}, { r: 2, c: 2}],
      [{ r: 2, c: 0 }, { r: 1, c: 1}, { r: 0, c: 2}],
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (boardData[a.r][a.c] && boardData[a.r][a.c] === boardData[b.r][b.c] && boardData[a.r][a.c] === boardData[c.r][c.c]) {
        setGame({...game, message: `${boardData[a.r][a.c]} won`, isOver: true});
      }
    }
  }

  const renderGame = () => {
    return (
      <Segment>
        <Segment.Group >
          <Segment>
            {game.isOver ? <div>{game.message}</div> : <div>{board.boardName}</div>}
          </Segment>
          <Segment>
            <Board playable onClick={(i, j) => handleClick(i, j)} board={board}/>
          </Segment>
          <Segment>
            <SaveModal disabled={!game.started} board={board} game={game} />
            <Button disabled={!game.started} onClick={handleReset}>Reset</Button>
            <Button onClick={handleListGames}>List Games</Button>
          </Segment>
      </Segment.Group>
      </Segment>
      
    )
  }
  
  const renderGameList = () => {
    return <GameList handleLoadGame={(id) => handleLoadGame(id)} />
  }

  
  if (gameListVisible) {
    return renderGameList()
  } else {
    return renderGame()
  }
}

export default App;
