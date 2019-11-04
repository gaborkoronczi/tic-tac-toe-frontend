import React from 'react';
import './Tile.css'

function Tile(props) {
    if (props.playable) {
        return <div className="tile" onClick={() => props.onClick()}>{props.value}</div>
    } else if (props.editable) {
        return <div className="tile" onClick={() => props.handleEdit()}>{props.value}</div>
    } else {
        return <div className="tile" >{props.value}</div>
    }
}

export default Tile;