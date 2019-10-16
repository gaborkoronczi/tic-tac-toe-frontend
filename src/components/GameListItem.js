import React from 'react';
import Board from './Board';

import { Segment, Button } from 'semantic-ui-react';

function GameListItem(props) {
    const { item } = props;

    return (
        <Segment.Group horizontal>
            <Segment>{item.boardName}</Segment>
            <Segment>{`${item.boardSize}x${item.boardSize}`}</Segment>
            <Segment><Board playable={false} board={item}/></Segment>
            <Segment><Button onClick={() => props.handleLoadGame(item.id)}>Load Game</Button></Segment>
        </Segment.Group>
    )
}

export default GameListItem;