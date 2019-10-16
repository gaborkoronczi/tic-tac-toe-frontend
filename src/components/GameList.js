import React, { useState, useEffect } from 'react';
import { Segment } from 'semantic-ui-react'

import tictactoe from '../api/tictactoe';
import GameListItem from './GameListItem';

function GameList(props) {
    const [listOfGames, setListOfGames] = useState([]);

    useEffect(() => {
        tictactoe.get("/boards")
            .then(response => {
                setListOfGames(response.data)
            })
            .catch(error => {
                console.log(error);
            })
    }, [])

    const renderListOfGames = () => {
        return listOfGames.map(item => {
            return <GameListItem key={item.id} handleLoadGame={(id) => props.handleLoadGame(id)} item={item}/>
        })
    }

    return (
        <Segment>
            {renderListOfGames()}
        </Segment>
    )
}

export default GameList;