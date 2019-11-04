import { createContext } from 'react';

export const GameContext = createContext({
	game: {},
	setGame: () => {},
	board: {}, 
	setBoard: () => {}
});

export const ListOfGamesContext = createContext({
    listOfGames: [],
    setListOfGames: () => {}
})