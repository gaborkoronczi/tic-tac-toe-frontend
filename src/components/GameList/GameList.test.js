import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, fireEvent, waitForElement, wait } from '@testing-library/react';

import tictactoeMock from '../../utils/api/tictactoe';
import GameList from './GameList';

jest.mock('../../utils/api/tictactoe', () => ({get: jest.fn()}))

afterEach(() => {
    jest.clearAllMocks();
});

it('renders list from api call', async () => {
    tictactoeMock.get.mockResolvedValueOnce({
        status: 200,
        data: [
            {
            "boardSize":3,
            "boardName":"testBoard1",
            "usersCells":[{"col":2,"row":2}],
            "computersCells":[{"col":0,"row":2}],
            "id":"testId1"
            },
            {
            "boardSize":3,
            "boardName":"testBoard2",
            "usersCells":[{"col":1,"row":0}],
            "computersCells":[{"col":0,"row":0}],
            "id":"testId2"
            }
        ]
    })
    const { queryByText } = render(
        <MemoryRouter>
            <GameList />
        </MemoryRouter>);
    
    const textNode1 = await waitForElement(() => queryByText('testBoard1'));
    const textNode2 = await waitForElement(() => queryByText('testBoard2'));

    expect(textNode1).not.toBeNull();
    expect(textNode2).not.toBeNull();
    expect(tictactoeMock.get).toHaveBeenCalledTimes(1);
    expect(tictactoeMock.get).toHaveBeenCalledWith('/boards/', { params: { boardNameFragment: ""}});
});

it('renders error on rejected api call', async () => {
    tictactoeMock.get.mockRejectedValueOnce({
        status: 400,
        data: "Some error"
    })
    const { queryByText } = render(
        <MemoryRouter>
            <GameList />
        </MemoryRouter>);
    
    const textNode = await waitForElement(() => queryByText('Error fetching boards!'));

    expect(textNode).not.toBeNull();
    expect(tictactoeMock.get).toHaveBeenCalledTimes(1);
    expect(tictactoeMock.get).toHaveBeenCalledWith('/boards/', { params: { boardNameFragment: ""}});
});

it('sends api call with correct filters on filter input change and rerenders correctly', async () => {
    tictactoeMock.get
    .mockResolvedValueOnce({
        status: 200,
        data: [
            {
            "boardSize":3,
            "boardName":"testBoard1",
            "usersCells":[{"col":2,"row":2}],
            "computersCells":[{"col":0,"row":2}],
            "id":"testId1"
            },
            {
            "boardSize":3,
            "boardName":"testBoard2",
            "usersCells":[{"col":1,"row":0}],
            "computersCells":[{"col":0,"row":0}],
            "id":"testId2"
            }
        ]
    })
    .mockResolvedValueOnce({
        status: 200,
        data: [
            {
            "boardSize":3,
            "boardName":"testBoard2",
            "usersCells":[{"col":2,"row":2}],
            "computersCells":[{"col":0,"row":2}],
            "id":"testId2"
            }
        ]
    })

    const { getByPlaceholderText, queryByText } = render(
        <MemoryRouter>
            <GameList />
        </MemoryRouter>);
    
    fireEvent.change(getByPlaceholderText('Filter'), { target: { value: '2' } });
    const textNode = await waitForElement(() => queryByText('testBoard2'));

    expect(textNode).not.toBeNull();
    expect(tictactoeMock.get).toHaveBeenCalledTimes(2);
    expect(tictactoeMock.get).toHaveBeenCalledWith('/boards/', { params: { boardNameFragment: "2"}});
});

it('sends api call with correct id on Load click', async () => {
    tictactoeMock.get
        .mockResolvedValueOnce({
            status: 200,
            data: [
                {
                "boardSize":3,
                "boardName":"testBoard1",
                "usersCells":[{"col":2,"row":2}],
                "computersCells":[{"col":0,"row":2}],
                "id":"testId1"
                },
                {
                "boardSize":3,
                "boardName":"testBoard2",
                "usersCells":[{"col":1,"row":0}],
                "computersCells":[{"col":0,"row":0}],
                "id":"testId2"
                }
            ]
        })
        .mockResolvedValueOnce({
            status: 200,
            data: [
                {
                "boardSize":3,
                "boardName":"testBoard1",
                "usersCells":[{"col":2,"row":2}],
                "computersCells":[{"col":0,"row":2}],
                "id":"testId1"
                }
            ]
        })
    
    const { queryAllByText } = render(
        <MemoryRouter>
            <GameList />
        </MemoryRouter>);
    
    await wait(() => queryAllByText('Load'));

    fireEvent.click(queryAllByText('Load')[0]);

    expect(tictactoeMock.get).toHaveBeenCalledTimes(2);
    expect(tictactoeMock.get).toHaveBeenCalledWith('/boards/testId1');
});