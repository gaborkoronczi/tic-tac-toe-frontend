import React, { useState } from 'react';

import Tile from './Tile';
import './Board.css'

function Board () {
    const [board, setBoard] = useState(
        {
            boardSize: 3,
            boardName: "",
            usersCells: [],
            computersCells: []
        }
    )

    const [game, setGame] = useState({ message: "", isOver: false });

    const USER_SYMBOL = "X";
    const COMPUTER_SYMBOL = "O";

    const renderBoard = () => {
        const boardData = translateBoard();
        let boardToBeRendered = []
        for (let i = 0; i < board.boardSize; i++) {
            let rowsToBeRendered = [];
            for (let j = 0; j < board.boardSize; j++) {
                rowsToBeRendered.push(<Tile key={`${i}${j}`} value={boardData[i][j]} onClick={() => handleClick(i + 1, j + 1)} />)
            }
            boardToBeRendered.push(<div key={`r${i}`} className="board-row">{rowsToBeRendered}</div>)
        }
        return boardToBeRendered;
    }
    
    const translateBoard = () => {
        let translatedBoard = []
        for (let i = 0; i < board.boardSize; i++) {
            let rows = []
            for (let j = 0; j < board.boardSize; j++) {
                rows.push(null)
            }
            translatedBoard.push(rows);
        }
        board.usersCells.forEach(e => {
            translatedBoard[e.row - 1][e.col - 1] = USER_SYMBOL;
        })
        board.computersCells.forEach(e => {
            translatedBoard[e.row - 1][e.col - 1] = COMPUTER_SYMBOL;
        })
        return translatedBoard;
    }

    const handleClick = (row, col) => {
        makeTurn(row, col)
    }

    const makeTurn = (row, col) => {
        if (!findUsersCell(row, col) && !findComputersCell(row, col) && !game.isOver) {
            let usersCell = {row, col}
            let computersCell = {};
            let computerCellFound = false;
            const boardData = translateBoard();
            for (let i = 0; i < board.boardSize; i++) {
                for (let j = 0; j < board.boardSize; j++) {
                    if (!boardData[i][j] && i+1 !== row && j+1 !== col ) {
                        computersCell = { row: i+1, col: j+1 }
                        computerCellFound = true;
                    }
                }
            }
            if (computerCellFound) {
                setBoard({...board, usersCells: board.usersCells.concat(usersCell), computersCells: board.computersCells.concat(computersCell)})
                checkForWinner(usersCell, computersCell);
            } else {
                setBoard({...board, usersCells: board.usersCells.concat(usersCell)})
                setGame({ message: "draw", isOver: true});
            }
            
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
        const boardData = translateBoard();
        boardData[usersCell.row - 1][usersCell.col -1 ] = USER_SYMBOL;
        boardData[computersCell.row - 1][computersCell.col -1 ] = COMPUTER_SYMBOL;

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
                setGame({ message: `${boardData[a.r][a.c]} won`, isOver: true});
            }
        }
    }

    return (
        <div className="board">
            {renderBoard()}
            {game.isOver ? <div>{game.message}</div> : <div></div>}
        </div>
    )
}

export default Board;