import React, { useState, useEffect, useContext } from 'react';

import { Segment, Input, Message, Card, Header, Icon } from 'semantic-ui-react';
import { useHistory } from "react-router-dom";

import tictactoe from '../../utils/api/tictactoe';
import GameListItem from './GameListItem/GameListItem';
import { GameContext, ListOfGamesContext } from '../../contexts';

function GameList() {
    const [listOfGames, setListOfGames] = useState([]);
    const [filter, setFilter] = useState("");
    const [message, setMessage] = useState({ hidden: true, type: "", text: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const { setGame, setBoard } = useContext(GameContext);
    const history = useHistory();

    useEffect(() => {
        setLoading(true);
        tictactoe.get('/boards/', { params: { boardNameFragment: filter} })
        .then(response => {
            setListOfGames(response.data);
            setLoading(false);
            setError(false);
        })
        .catch(({response}) => {
            setLoading(false);
            setError(true);
        })
    }, [filter])
    
    const handleMessageDismiss = () => {
        setMessage({...message, hidden: true});
    }
    
    const handleChange = (e) => {
        setFilter(e.target.value);
    }
    
    const handleLoadGame = ({id, boardName}) => {
        tictactoe.get(`/boards/${id}`)
            .then(({ status, data }) => {
                if (status === 200) {
                    history.push("/");
                    setGame( {message: "", isOver: false, started: true});
                    setBoard( {boardSize: data.boardSize, boardName: data.boardName, usersCells: data.usersCells, computersCells: data.computersCells } );
                }
            })
            .catch(({response}) => {
                let text = `Loading ${boardName} failed!`;
                if (response.status === 404) {
                    text = `${response.status} ${response.data}`;
                }
                setMessage({ hidden: false, type: 'negative', text});
            })
    }

    const renderListOfGames = () => {
        return listOfGames.map(item => {
            return (
                <GameListItem
                    key={item.id}
                    handleLoadGame={(id) => handleLoadGame(id)}
                    item={item}
                    setMessage={setMessage}
                />
            );
        })
    }

    const renderPlaceholder = () => {
        return (
                <Header icon>
                    <Icon name='exclamation' />
                    Error fetching boards!
                </Header>
        );
    }

    return (
        <Segment.Group>
            <Segment>
                <Input label='Filter' placeholder='Filter' onChange={handleChange} value={filter} />
                <Message 
                    hidden={message.hidden}
                    positive={message.type === 'positive' ? true : false}
                    negative={message.type === 'negative' ? true : false}
                    content={message.text}
                    onDismiss={handleMessageDismiss}
                />
            </Segment>
            <Segment loading={loading} placeholder={error} style={{minHeight: '3rem'}}>
                    {error ?
                        renderPlaceholder()
                        :
                        <Card.Group>
                            <ListOfGamesContext.Provider value={{ listOfGames, setListOfGames }}>
                                {renderListOfGames()}
                            </ListOfGamesContext.Provider>
                        </Card.Group>}
            </Segment>
        </Segment.Group>
        )
    }
    
    export default GameList;