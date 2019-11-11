import React, { useContext, useState } from 'react';

import { Segment, Button, Message } from 'semantic-ui-react';

import SaveModal from './SaveModal/SaveModal';
import { GameContext } from '../../contexts';
import { translateBoard, initialBoard } from '../../utils/utils'
import { USER_SYMBOL, COMPUTER_SYMBOL } from '../../utils/const';
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
        setBoard(initialBoard);
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
        if (!findUsersCell(row, col) && !findComputersCell(row, col) && !game.isOver) {
            let usersCell = {row, col};
            let computersCell = {};
            let computerCellFound = false;
            const boardData = translateBoard(workingBoard);
            boardData[row][col] = USER_SYMBOL;
            for (let i = 0; i < workingBoard.boardSize && !computerCellFound; i++) {
                for (let j = 0; j < workingBoard.boardSize && !computerCellFound; j++) {
                    if (!boardData[i][j] ) {
                        computersCell = { row: i, col: j };
                        computerCellFound = true;
                    }
                }
            }
            if (computerCellFound) {
                setBoard({
                    ...workingBoard,
                    usersCells: workingBoard.usersCells.concat(usersCell),
                    computersCells: workingBoard.computersCells.concat(computersCell)
                });
            } else {
                setBoard({...workingBoard,
                    usersCells: workingBoard.usersCells.concat(usersCell)
                });
                setGame({...game, message: "Draw!", isOver: true});
            }
            checkForWinner(usersCell, computersCell);
        }
    }
    
    const findUsersCell = (row, col) => {
        return workingBoard.usersCells.find(i => {
            return i.row === row && i.col === col
        });
    }
    
    const findComputersCell = (row, col) => {
        return workingBoard.computersCells.find(i => {
            return i.row === row && i.col === col
        });
    }
    
    const checkForWinner = (usersCell, computersCell) => {
        const boardData = translateBoard(workingBoard);
        boardData[usersCell.row][usersCell.col] = USER_SYMBOL;
        if (Object.keys(computersCell).length > 0) {
            boardData[computersCell.row][computersCell.col] = COMPUTER_SYMBOL;
        }
        
        const winningCondition = [
            [{ r: 0, c: 0 }, { r: 0, c: 1}, { r: 0, c: 2}],
            [{ r: 1, c: 0 }, { r: 1, c: 1}, { r: 1, c: 2}],
            [{ r: 2, c: 0 }, { r: 2, c: 1}, { r: 2, c: 2}],
            [{ r: 0, c: 0 }, { r: 1, c: 0}, { r: 2, c: 0}],
            [{ r: 0, c: 1 }, { r: 1, c: 1}, { r: 2, c: 1}],
            [{ r: 0, c: 2 }, { r: 1, c: 2}, { r: 2, c: 2}],
            [{ r: 0, c: 0 }, { r: 1, c: 1}, { r: 2, c: 2}],
            [{ r: 2, c: 0 }, { r: 1, c: 1}, { r: 0, c: 2}],
        ];
    
        for (let i = 0; i < winningCondition.length; i++) {
            const [a, b, c] = winningCondition[i];
            if (
                boardData[a.r][a.c] &&
                boardData[a.r][a.c] === boardData[b.r][b.c] &&
                boardData[a.r][a.c] === boardData[c.r][c.c]
            ) {
                setGame({...game, message: `${boardData[a.r][a.c]} won the game!`, isOver: true});
            }
        }
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
        return <div className="board">{boardToBeRendered}</div>;
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