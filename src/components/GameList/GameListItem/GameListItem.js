import React from 'react';

import { Card, Button } from 'semantic-ui-react';

import Board from '../../Board/Board';
import EditModal from '../EditModal/EditModal';
import DeleteModal from '../DeleteModal/DeleteModal';

function GameListItem({ item, handleLoadGame, handleDeleteGame, setMessage}) {
    
    return (
        <Card>
            <Board playable={false} board={item}/>
            <Card.Content>
                <Card.Header>{item.boardName}</Card.Header>
                <Card.Meta>
                    {`${item.boardSize}x${item.boardSize}`}
                </Card.Meta>
            </Card.Content>
            <Card.Content extra>
                <Button.Group fluid >
                    <Button basic onClick={() => handleLoadGame(item)} color='blue'>Load</Button>
                    <EditModal item={item} setMessage={setMessage}/>
                    <DeleteModal item={item} setMessage={setMessage}/>
                </Button.Group>
            </Card.Content>
        </Card>
       
    )
}

export default GameListItem;