import React from 'react';
import { translateBoard } from '../utils'

import Tile from './Tile';
import './Board.css'

function Board (props) {

    const renderBoard = () => {
        const boardData = translateBoard(props.board);
        let boardToBeRendered = []
        for (let i = 0; i < props.board.boardSize; i++) {
            let rowsToBeRendered = [];
            for (let j = 0; j < props.board.boardSize; j++) {
                    rowsToBeRendered.push(<Tile playable={props.playable} key={`${i}${j}`} value={boardData[i][j]} onClick={() => props.onClick(i, j)} />)
            }
            boardToBeRendered.push(<div key={`r${i}`} className="board-row">{rowsToBeRendered}</div>)
        }
        return boardToBeRendered;
    }

    return (
        <div className="board">
            {renderBoard()}
        </div>
    )
}

export default Board;