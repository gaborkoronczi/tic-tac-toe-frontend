import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';

import tictactoeMock from '../../../utils/api/tictactoe';
import DeleteModal from './DeleteModal';
import { ListOfGamesContext } from '../../../contexts';

jest.mock('../../../utils/api/tictactoe', () => ({delete: jest.fn()}));

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

it('sends proper api call with correct data, sets message and deletes local data', async () => {
    tictactoeMock.delete.mockResolvedValueOnce({
        status: 200
    });
    
    const board = {...listOfGames[0]};

    const { getByText } = render(
        <ListOfGamesContext.Provider value={{ listOfGames, setListOfGames }}>
            <DeleteModal
                item={board}
                setMessage={setMessage}
            />
        </ListOfGamesContext.Provider>
    );
    
    fireEvent.click(getByText('Delete'));
    fireEvent.click(getByText('Yes'));
    
    await wait(() => {
        expect(tictactoeMock.delete).toHaveBeenCalledTimes(1);
        expect(tictactoeMock.delete).toHaveBeenCalledWith(`/boards/${board.id}`);
        expect(message.text).toBe(`test deleted succesfully!`);
        expect(listOfGames[0].boardName).toBe('anotherTest');
        expect(listOfGames[0].id).toBe('testId2');
        expect(listOfGames).toHaveLength(1);
    });
});