import React from 'react';
import './Tile.css'

function Tile(props) {

    return (
        <div
            className="tile"
            data-testid={`tile-${props.testId}`}
            onClick={ 
                props.playable ?
                    () => props.onClick()
                    :
                    props.editable ?
                    () => props.handleEdit()
                    :
                    null 
            }
        >
            {props.value}
        </div>
    );
}

export default Tile;