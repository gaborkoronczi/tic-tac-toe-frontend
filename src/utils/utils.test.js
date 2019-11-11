import { translateBoard } from './utils';

test('translateBoard', () => {
    const testBoard1 = {
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
    }
    const testBoard2 = {
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

    const translatedBoard1 = translateBoard(testBoard1);
    const translatedBoard2 = translateBoard(testBoard2);

    expect(translatedBoard1).toEqual(
        [
            [ 'X', 'O', 'O' ],
            [ 'O', 'X', 'X' ],
            [ 'X', 'O', 'X' ]
        ]
    );
    expect(translatedBoard2).toEqual(
        [
            [ 'X', 'O', 'O' ],
            [ 'O', 'X', 'X' ],
            [ 'X', 'O', null ]
        ]
    );
});