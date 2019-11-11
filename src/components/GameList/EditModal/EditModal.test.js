import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';

import tictactoeMock from '../../../utils/api/tictactoe';
import EditModal from './EditModal';
import { ListOfGamesContext } from '../../../contexts';

jest.mock('../../../utils/api/tictactoe', () => ({put: jest.fn()}));

let message = '';
const setMessage = (newMessage) => { message = newMessage };
let listOfGames = [];
const setListOfGames = (newList) => { listOfGames = newList };

beforeEach(() => {
    listOfGames = [
        {
            boardSize: 3,
            boardName: 'test',
            usersCells: [
                { col: 1, row: 0 }
            ],
            computersCells: [
                { col: 0, row: 0 }
            ],
            id: 'testId'
        },
        {
            boardSize: 3,
            boardName: 'anotherTest',
            usersCells: [
                { col: 2, row: 2 }
            ],
            computersCells: [
                { col: 1, row: 1 }
            ],
            id: 'testId2'
        },
    ]
});

afterEach(() => {
    jest.clearAllMocks();
    message = '';
});

it('sends proper api call with correct data, sets message and edits local data', async () => {
    const testName = 'test';
    const testResultName = 'test2';
    tictactoeMock.put.mockResolvedValueOnce({
        status: 200,
        data: {
            boardSize: 3,
            boardName: testResultName,
            usersCells: [
                { col: 1, row: 0 }
            ],
            computersCells: [
                { col: 0, row: 0 }
            ],
            id: 'testId'
        }
    });
    
    const board = {
        boardSize: 3,
        boardName: testName,
        usersCells: [
            { col: 1, row: 0 }
        ],
        computersCells: [
            { col: 0, row: 0 }
        ],
        id: 'testId'
    };

    const expectedRequest = {
        boardSize: 3,
        boardName: testResultName,
        usersCells: [
            { col: 1, row: 0 }
        ],
        computersCells: [
            { col: 0, row: 0 }
        ],
        id: 'testId'
    };

    const { getByText, getByRole } = render(
        <ListOfGamesContext.Provider value={{ listOfGames, setListOfGames }}>
            <EditModal
                item={board}
                setMessage={setMessage}
            />
        </ListOfGamesContext.Provider>
    );
    
    fireEvent.click(getByText('Edit'));
    fireEvent.change(getByRole('textbox'), { target: { value: testResultName } });
    fireEvent.click(getByText('Save', { exact: true }));
    
    await wait(() => {
        expect(tictactoeMock.put).toHaveBeenCalledTimes(1);
        expect(tictactoeMock.put).toHaveBeenCalledWith(`/boards/${board.id}`, expectedRequest);
        expect(message.text).toBe(`${testResultName} edited successfully!`);
        expect(listOfGames[0].boardName).toBe(testResultName);
    });
});