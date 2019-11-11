import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';

import tictactoeMock from '../../../utils/api/tictactoe';
import SaveModal from './SaveModal';

jest.mock('../../../utils/api/tictactoe', () => ({post: jest.fn()}));

let message = '';
const setMessage = (newMessage) => { message = newMessage }

afterEach(() => {
    jest.clearAllMocks();
    message = '';
});

it('sends proper api call with correct data and sets message', async () => {
    tictactoeMock.post.mockResolvedValueOnce({
        status: 201,
        data: {
            boardSize: 3,
            boardName: "test",
            usersCells: [
                { col: 1, row: 0 }
            ],
            computersCells: [
                { col: 0, row: 0 }
            ]
        }
    });
    
    const testName = 'test';

    const board = {
        boardSize: 3,
        boardName: "",
        usersCells: [
            { col: 1, row: 0 }
        ],
        computersCells: [
            { col: 0, row: 0 }
        ]
    };

    const expectedRequest = {
        boardSize: 3,
        boardName: testName,
        usersCells: [
            { col: 1, row: 0 }
        ],
        computersCells: [
            { col: 0, row: 0 }
        ]
    };

    const { getByText, getByRole } = render(
        <SaveModal
            board={board}
            setMessage={setMessage}
        />
    );
    
    fireEvent.click(getByText('Save Game'));
    fireEvent.change(getByRole('textbox'), { target: { value: testName } });
    fireEvent.click(getByText('Save', { exact: true }));
    
    await wait(() => {
        expect(tictactoeMock.post).toHaveBeenCalledTimes(1);
        expect(tictactoeMock.post).toHaveBeenCalledWith('/boards', expectedRequest);
        expect(message.text).toBe('Game saved successfully as test!');
    });
});