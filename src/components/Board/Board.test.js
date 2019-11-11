import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import Board from './Board';
import { GameContext } from '../../contexts';
import { initialBoard } from '../../utils/utils';
import { USER_SYMBOL, COMPUTER_SYMBOL } from '../../utils/const';

let board;
let game;
const setBoard = (newBoard) => { board = newBoard };
const setGame = (newGame) => { game = newGame };

beforeEach(() => {
    board = initialBoard;
    game = { message: "", isOver: false, started: false };
});

it('render correct amount of tiles', () => {
    const { getAllByTestId } = render(<Board board={initialBoard} />);

    expect(getAllByTestId('tile', { exact: false })).toHaveLength(9);
});

it('renders non playable without buttons', () => {
    const { queryByText} = render(<Board board={initialBoard} />);
    expect(queryByText('Save Game')).toBeNull();
    expect(queryByText('Reset')).toBeNull();
});

it("doesn't change non playable game on click", () => {
    const { getByTestId, getAllByTestId } = render(<Board board={initialBoard} />);
    
    fireEvent.click(getByTestId('tile-00'));

    const tiles = getAllByTestId('tile', { exact: false});
    tiles.forEach(item => {
        expect(item).toBeEmpty();
    });
    expect(board).toEqual(initialBoard);
});

it('renders playable empty board with disabled buttons', () => {
    const { getByText, getAllByTestId } = render(
        <GameContext.Provider value={{ game, setGame, board, setBoard }}>
            <Board playable />
        </GameContext.Provider>
    );

    const tiles = getAllByTestId('tile', { exact: false});
    tiles.forEach(item => {
        expect(item).toBeEmpty();
    });
    expect(getByText('Save Game')).toBeDisabled();
    expect(getByText('Reset')).toBeDisabled();
});

it('renders user and computer symbol on click and enables save and reset', () => {
    const { rerender, getByText, getByTestId, getAllByTestId } = render(
        <GameContext.Provider value={{ game, setGame, board, setBoard }}>
            <Board playable />
        </GameContext.Provider>
    );

    fireEvent.click(getByTestId('tile-01'));
    rerender(
        <GameContext.Provider value={{ game, setGame, board, setBoard }}>
            <Board playable />
        </GameContext.Provider>
    )

    const tiles = getAllByTestId('tile', { exact: false});
    expect(getByTestId('tile-01')).toHaveTextContent(USER_SYMBOL);
    expect(tiles.some(item => item.textContent === COMPUTER_SYMBOL)).toBeTruthy();
    expect(getByText('Save Game')).toBeEnabled();
    expect(getByText('Reset')).toBeEnabled();
    expect(board.boardSize).toBe(3);
    expect(board.usersCells).toHaveLength(1);
    expect(board.usersCells[0]).toHaveProperty('col', 1);
    expect(board.usersCells[0]).toHaveProperty('row', 0);
    expect(board.computersCells).toHaveLength(1);
    expect(board.usersCells[0]).toHaveProperty('col');
    expect(board.usersCells[0]).toHaveProperty('row');
});

it("doesn't overwrite computer's tile on click", () => {
    const testBoard = {
        boardSize: 3,
        boardName: "",
        usersCells: [
            { col: 1, row: 0 }
        ],
        computersCells: [
            { col: 0, row: 0 }
        ]
    };
    board = {...testBoard};
    game = {
        message: "",
        isOver: false,
        started: true
    }
    const { rerender, getByTestId } = render(
        <GameContext.Provider value={{ game, setGame, board, setBoard }}>
            <Board playable />
        </GameContext.Provider>
    );
    
    fireEvent.click(getByTestId('tile-00'));
    rerender(
        <GameContext.Provider value={{ game, setGame, board, setBoard }}>
            <Board playable />
        </GameContext.Provider>
    );

    expect(getByTestId('tile-00')).toHaveTextContent(COMPUTER_SYMBOL);
    expect(board).toEqual(testBoard);
});

it("shows proper message on user win and disables save", () => {
    board = {
        boardSize: 3,
        boardName: "",
        usersCells: [
            { col: 0 , row: 0 },
            { col: 1 , row: 1 },
            { col: 2 , row: 1 },
            { col: 0 , row: 2 }
        ],
        computersCells: [
            { col: 1 , row: 0 },
            { col: 2 , row: 0 },
            { col: 0 , row: 1 },
            { col: 1 , row: 2 }
        ]
    };
    game = {
        message: "",
        isOver: false,
        started: true
    }
    const { rerender, queryByText, getByText, getByTestId } = render(
        <GameContext.Provider value={{ game, setGame, board, setBoard }}>
            <Board playable />
        </GameContext.Provider>
    );

    fireEvent.click(getByTestId('tile-22'));
    rerender(
        <GameContext.Provider value={{ game, setGame, board, setBoard }}>
            <Board playable />
        </GameContext.Provider>
    );
    
    expect(queryByText('X won the game!')).not.toBeNull();
    expect(getByText('Save Game')).toBeDisabled();
    expect(getByText('Reset')).toBeEnabled();
    expect(board).toEqual({
            boardSize: 3,
            boardName: "",
            usersCells: [
                { col: 0 , row: 0 },
                { col: 1 , row: 1 },
                { col: 2 , row: 1 },
                { col: 0 , row: 2 },
                { col: 2 , row: 2 }
            ],
            computersCells: [
                { col: 1 , row: 0 },
                { col: 2 , row: 0 },
                { col: 0 , row: 1 },
                { col: 1 , row: 2 }
            ]
    });
    expect(game).toEqual({
        message: "X won the game!",
        isOver: true,
        started: true
    });
});

it("shows proper message on computer win and disables save", () => {
    board = {
        boardSize: 3,
        boardName: "",
        usersCells: [
            { col: 1 , row: 0 },
            { col: 0 , row: 1 },
            { col: 0 , row: 2 }
        ],
        computersCells: [
            { col: 0 , row: 0 },
            { col: 2 , row: 0 },
            { col: 1 , row: 1 },
            { col: 2 , row: 1 },
        ]
    };
    game = {
        message: "",
        isOver: false,
        started: true
    }
    const { rerender, queryByText, getByText, getByTestId } = render(
        <GameContext.Provider value={{ game, setGame, board, setBoard }}>
            <Board playable />
        </GameContext.Provider>
    );

    fireEvent.click(getByTestId('tile-21'));
    rerender(
        <GameContext.Provider value={{ game, setGame, board, setBoard }}>
            <Board playable />
        </GameContext.Provider>
    );
    
    expect(queryByText('O won the game!')).not.toBeNull();
    expect(getByText('Save Game')).toBeDisabled();
    expect(getByText('Reset')).toBeEnabled();
    expect(board).toEqual({
        boardSize: 3,
        boardName: "",
        usersCells: [
            { col: 1 , row: 0 },
            { col: 0 , row: 1 },
            { col: 0 , row: 2 },
            { col: 1 , row: 2 }
        ],
        computersCells: [
            { col: 0 , row: 0 },
            { col: 2 , row: 0 },
            { col: 1 , row: 1 },
            { col: 2 , row: 1 },
            { col: 2 , row: 2 }
        ]
    });
    expect(game).toEqual({
        message: "O won the game!",
        isOver: true,
        started: true
    });
});

it("shows proper message on draw and disables save", () => {
    board = {
        boardSize: 3,
        boardName: "",
        usersCells: [
            { col: 2 , row: 0 },
            { col: 0 , row: 1 },
            { col: 1 , row: 1 },
            { col: 1 , row: 2 }
        ],
        computersCells: [
            { col: 0 , row: 0 },
            { col: 1 , row: 0 },
            { col: 2 , row: 1 },
            { col: 0 , row: 2 }
        ]
    };
    game = {
        message: "",
        isOver: false,
        started: true
    }
    const { rerender, queryByText, getByText, getByTestId } = render(
        <GameContext.Provider value={{ game, setGame, board, setBoard }}>
            <Board playable />
        </GameContext.Provider>
    );

    fireEvent.click(getByTestId('tile-22'));
    rerender(
        <GameContext.Provider value={{ game, setGame, board, setBoard }}>
            <Board playable />
        </GameContext.Provider>
    );
    
    expect(queryByText('Draw!')).not.toBeNull();
    expect(getByText('Save Game')).toBeDisabled();
    expect(getByText('Reset')).toBeEnabled();
    expect(board).toEqual({
        boardSize: 3,
        boardName: "",
        usersCells: [
            { col: 2 , row: 0 },
            { col: 0 , row: 1 },
            { col: 1 , row: 1 },
            { col: 1 , row: 2 },
            { col: 2 , row: 2 }
        ],
        computersCells: [
            { col: 0 , row: 0 },
            { col: 1 , row: 0 },
            { col: 2 , row: 1 },
            { col: 0 , row: 2 }
        ]
    });
    expect(game).toEqual({
        message: "Draw!",
        isOver: true,
        started: true
    });
});

it("resets properly and disables save and reset", () => {
    board = {
        boardSize: 3,
        boardName: "",
        usersCells: [
            { col: 2 , row: 0 },
            { col: 0 , row: 1 },
            { col: 1 , row: 1 },
            { col: 1 , row: 2 },
            { col: 2 , row: 2 }
        ],
        computersCells: [
            { col: 0 , row: 0 },
            { col: 1 , row: 0 },
            { col: 2 , row: 1 },
            { col: 0 , row: 2 }
        ]
    };
    game = {
        message: "",
        isOver: false,
        started: true
    }
    const { rerender, getAllByTestId, getByText } = render(
        <GameContext.Provider value={{ game, setGame, board, setBoard }}>
            <Board playable />
        </GameContext.Provider>
    );

    fireEvent.click(getByText('Reset'));
    rerender(
        <GameContext.Provider value={{ game, setGame, board, setBoard }}>
            <Board playable />
        </GameContext.Provider>
    );
    
    const tiles = getAllByTestId('tile', { exact: false});
    tiles.forEach(item => {
        expect(item).toBeEmpty();
    });
    expect(getByText('Save Game')).toBeDisabled();
    expect(getByText('Reset')).toBeDisabled();
    expect(board).toEqual({
        boardSize: 3,
        boardName: "",
        usersCells: [],
        computersCells: []
    });
    expect(game).toEqual({
        message: "",
        isOver: false,
        started: false
    });
});

it('if given edit handler, properly edits values', () => {
    board = {
        boardSize: 3,
        boardName: "",
        usersCells: [
            { col: 1, row: 0 }
        ],
        computersCells: [
            { col: 0, row: 0 }
        ]
    };
    const handleEdit = (row, col, value) => {
        switch(value) {
            case USER_SYMBOL:
                setBoard({...board, usersCells: board.usersCells.concat({ row, col })})
                break;
            case COMPUTER_SYMBOL:
                setBoard({
                    ...board,
                    usersCells: board.usersCells.filter(item => { return !(item.row === row && item.col === col) }),
                    computersCells: board.computersCells.concat({ row, col})
                })
                break;
            default:
                setBoard({...board, computersCells: board.computersCells.filter(item => { return !(item.row === row && item.col === col) })});
        }
    };
    const { rerender, getByTestId } = render(
        <Board editHandler={handleEdit} board={board} />
    );

    fireEvent.click(getByTestId('tile-00'));
    fireEvent.click(getByTestId('tile-01'));
    fireEvent.click(getByTestId('tile-11'));
    rerender(
        <Board editHandler={handleEdit} board={board} />
    );

    expect(getByTestId('tile-00')).toBeEmpty();
    expect(getByTestId('tile-01')).toHaveTextContent(COMPUTER_SYMBOL);
    expect(getByTestId('tile-11')).toHaveTextContent(USER_SYMBOL);
    expect(board).toEqual({
        boardSize: 3,
        boardName: "",
        usersCells: [
            { col: 1, row: 1 }
        ],
        computersCells: [
            { col: 1, row: 0 }
        ]
    });
});