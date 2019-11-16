import React, { useContext, useState } from 'react';

import { Segment, Button, Message } from 'semantic-ui-react';

import SaveModal from './SaveModal/SaveModal';
import { GameContext } from '../../contexts';
import { translateBoard } from '../../utils/utils'
import { USER_SYMBOL, COMPUTER_SYMBOL, WINNING_LENGTH } from '../../utils/const';
import Tile from './Tile/Tile';
import './Board.css'

function Board (props) {
    const { game, setGame, board, setBoard } = useContext(GameContext);
    const [message, setMessage] = useState({ hidden: true, type: "", text: "" });

    let workingBoard;

    if (props.playable) {
        workingBoard = board;
    } else {
        workingBoard = props.board; 
    }

    const handleMessageDismiss = () => {
        setMessage({...message, hidden: true});
    }

    const handleReset = () => {
        setGame({ message: "", isOver: false, started: false});
        setBoard({...workingBoard, usersCells: [], computersCells: []});
    }

    const handleClick = (row, col) => {
        if (!game.started) {
          setGame({...game, started: true});
        }
        makeTurn(row, col);
    }

    const handleEdit = (row, col, value) => {
        let newValue;

        switch(value) {
            case USER_SYMBOL:
                newValue = COMPUTER_SYMBOL;
                break;
            case COMPUTER_SYMBOL:
                newValue = "";
                break;
            default:
                newValue = USER_SYMBOL;
        }
        props.editHandler(row, col, newValue);
    }

    const makeTurn = (row, col) => {
        const boardData = translateBoard(workingBoard);
        if(isCellEmpty(boardData, row, col)) {
            move(boardData, {row, col, symbol: USER_SYMBOL});
            if(checkForWinner(boardData, {row, col, symbol: USER_SYMBOL})) {
                setBoard({...workingBoard,
                    usersCells: workingBoard.usersCells.concat({row, col})
                });
                setGame({...game, message: `${USER_SYMBOL} won the game!`, isOver: true});
            } else if (!isBoardFull(boardData)) {
                let computerRow, computerCol;
                do {
                    computerRow = getRandomInteger(0, workingBoard.boardSize);
                    computerCol = getRandomInteger(0, workingBoard.boardSize);
                } while (!isCellEmpty(boardData, computerRow, computerCol));
                move(boardData, {row: computerRow, col: computerCol, symbol: COMPUTER_SYMBOL});
                setBoard({
                    ...workingBoard,
                    usersCells: workingBoard.usersCells.concat({row, col}),
                    computersCells: workingBoard.computersCells.concat({row: computerRow, col: computerCol})
                });
                if (checkForWinner(boardData, {row: computerRow, col: computerCol, symbol: COMPUTER_SYMBOL})) {
                    setGame({...game, message: `${COMPUTER_SYMBOL} won the game!`, isOver: true});
                }
            } else {
                setBoard({...workingBoard,
                    usersCells: workingBoard.usersCells.concat({row, col})
                });
                setGame({...game, message: "Draw!", isOver: true});
            }
        }
    };

    const move = (board, move) => {
        const { row, col, symbol } = move;
        board[row][col] = symbol;
    }

    const isCellEmpty = (board, row, col) => {
        return board[row][col] === null ? true : false
    }

    const isBoardFull = (board) => {
        return board.every((row) => {
            return row.every((col) => col !== null);
        });
    }

    const getRandomInteger = (min, max) => {
        return Math.floor(Math.random() * (max - min) ) + min;
    }

    const checkForWinner = (board, lastMove) => {
        const boardSize = board.length;
        const { row, col, symbol } = lastMove;
        
        for (let i = 0; i < WINNING_LENGTH; i++) {
            const colArray = [];
            const rowArray = [];
            const diagonalArray = [];
            const antiDiagonalArray = [];

            for (let j = 0; j < WINNING_LENGTH; j++) {
                let currentCol = col-i+j;
                if (currentCol >= 0 && currentCol < boardSize) {
                    colArray.push(board[row][currentCol]);  
                }
                if (colArray.every((val) => val === symbol) && colArray.length === WINNING_LENGTH) {
                    return symbol;
                };

                let currentRow = row-i+j;
                if (currentRow >= 0 && currentRow < boardSize) {
                    rowArray.push(board[currentRow][col]);
                }
                if (rowArray.every((val) => val === symbol) && rowArray.length === WINNING_LENGTH) {
                    return symbol;
                };

                if (
                    currentRow >= 0 &&
                    currentCol >= 0 &&
                    currentRow < boardSize &&
                    currentCol < boardSize
                ) {
                  diagonalArray.push(board[currentRow][currentCol]); 
                }
                if (diagonalArray.every((val) => val === symbol) && diagonalArray.length === WINNING_LENGTH) {
                    return symbol;
                };

                let currentAntiDiagonalCol = col-i-j;
                if (currentRow >= 0 &&
                    currentAntiDiagonalCol >= 0 &&
                    currentRow < boardSize &&
                    currentAntiDiagonalCol < boardSize
                ) {
                    antiDiagonalArray.push(board[currentRow][currentAntiDiagonalCol]);
                };
                if (antiDiagonalArray.every((val) => val === symbol) && antiDiagonalArray.length === WINNING_LENGTH) {
                    return symbol;
                };
            }
        }
        return false;
    }

    const renderBoard = () => {
        const boardData = translateBoard(workingBoard);
        let boardToBeRendered = []
        for (let i = 0; i < workingBoard.boardSize; i++) {
            for (let j = 0; j < workingBoard.boardSize; j++) {
                boardToBeRendered.push(
                    <Tile
                        playable={props.playable}
                        editable={!(props.editHandler === undefined)}
                        key={`${i}${j}`}
                        testId={
                            workingBoard.id ?
                            `${i}${j}-${workingBoard.id}`
                            :
                            `${i}${j}`
                        }
                        value={boardData[i][j]}
                        onClick={() => handleClick(i, j)}
                        handleEdit={() => handleEdit(i, j, boardData[i][j])}
                    />
                );
            }
        }
        return (
            <div
                className="board"
                style={{
                    gridTemplateColumns: `repeat(${workingBoard.boardSize}, 1fr)`,
                    gridTemplateRows: `repeat(${workingBoard.boardSize}, 1fr)`,
                    fontSize: `${20/workingBoard.boardSize}rem`
                }}
            >
                {boardToBeRendered}
            </div>
        );
    }

    const renderPlayableBoard = () => {
        return (
            <Segment style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                <Segment.Group>
                    <Segment>
                        <Message 
                            hidden={message.hidden}
                            positive={message.type === 'positive' ? true : false}
                            negative={message.type === 'negative' ? true : false}
                            content={message.text}
                            onDismiss={handleMessageDismiss}
                        />
                        <Message 
                            hidden={!game.isOver}
                            info
                            content={game.message}
                        />
                    </Segment>
                    <Segment>
                        {renderBoard()}
                    </Segment>
                    <Segment>
                        <SaveModal
                            disabled={!game.started || game.isOver}
                            board={workingBoard}
                            game={game}
                            setMessage={setMessage}
                        />
                        <Button disabled={!game.started} onClick={handleReset}>Reset</Button>
                    </Segment>
                </Segment.Group>
            </Segment>
        );
    }

    return props.playable ? renderPlayableBoard() : renderBoard();
}

export default Board;