import React, { useState, useEffect } from 'react';
import { Segment, Input, Button } from 'semantic-ui-react'

import tictactoe from '../api/tictactoe';
import GameListItem from './GameListItem';

function GameList(props) {
    const [listOfGames, setListOfGames] = useState([]);
    const [filter, setFilter] = useState("");

    useEffect(() => {
        tictactoe.get('/boards/', { params: { boardNameFragment: filter} })
            .then(response => {
                setListOfGames(response.data)
            })
            .catch(error => {
                console.log(error);
            })
    }, [filter])

    const renderListOfGames = () => {
        return listOfGames.map(item => {
            return <GameListItem key={item.id} handleLoadGame={(id) => props.handleLoadGame(id)} item={item}/>
        })
    }

    const handleChange = (e) => {
        setFilter(e.target.value)
    }

    return (
        <Segment.Group>
            <Segment>
                <Input label='Filter' placeholder='Filter' onChange={handleChange} value={filter} />
                <Button floated='right' onClick={props.handleBack}>Back</Button>
            </Segment>
            <Segment>{renderListOfGames()}</Segment>
        </Segment.Group>
    )
}

export default GameList;