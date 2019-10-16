import { USER_SYMBOL, COMPUTER_SYMBOL } from './const';

export const translateBoard = (board) => {
    let translatedBoard = []
    for (let i = 0; i < board.boardSize; i++) {
        let rows = []
        for (let j = 0; j < board.boardSize; j++) {
            rows.push(null)
        }
        translatedBoard.push(rows);
    }
    board.usersCells.forEach(e => {
        translatedBoard[e.row][e.col] = USER_SYMBOL;
    })
    board.computersCells.forEach(e => {
        translatedBoard[e.row][e.col] = COMPUTER_SYMBOL;
    })
    return translatedBoard;
}