import React, { useState } from 'react';

import { Switch, Route } from "react-router-dom";

import Home from '../../routes/home';
import LoadGame from '../../routes/load-game';

import NavBar from '../NavBar/NavBar';
import { initialBoard } from '../../utils/utils';
import { GameContext } from '../../contexts';

function App() {
	const [board, setBoard] = useState(initialBoard);
	const [game, setGame] = useState({ message: "", isOver: false, started: false });
	
	return (
		<GameContext.Provider value={{ game, setGame, board, setBoard }}>
			<NavBar />
			<Switch>
				<Route path='/load-game'>
					<LoadGame />
				</Route>
				<Route path='/'>
					<Home />
				</Route>
			</Switch>
		</GameContext.Provider>
	);
}
	
export default App;
	