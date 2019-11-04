import React, { useState, useContext } from 'react';

import { Button, Modal } from 'semantic-ui-react'

import { ListOfGamesContext} from '../../../contexts';
import tictactoe from '../../../utils/api/tictactoe';

function DeleteModal(props) {
    const [modalOpen, setModalOpen] = useState(false);
    const { listOfGames, setListOfGames } = useContext(ListOfGamesContext);

    const handleOpen = () => setModalOpen(true)

    const handleClose = () => {
       setModalOpen(false)
    }

    const handleDeleteGame = ({id, boardName}) => {
        tictactoe.delete(`/boards/${id}`)
            .then(({ status }) => {
                if (status === 200) {
                    props.setMessage({ hidden: false, type: 'positive', text: `${boardName} deleted succesfully!`});
                    setListOfGames(listOfGames.filter(item => item.id !== id));
                    handleClose();
                }
            })
            .catch(({response}) => {
                let text = `Deleting ${boardName} failed!`;
                if (response.status === 404) {
                    text = `${response.status} ${response.data}`;
                }
                props.setMessage({ hidden: false, type: 'negative', text});
                handleClose();
            })
    }

    return (
        <Modal  open={modalOpen} onClose={handleClose} trigger={<Button basic onClick={handleOpen} color='red'>Delete</Button>} size='tiny'>
            <Modal.Header>Delete Game</Modal.Header>
            <Modal.Content >
                Are you sure you want to delete {props.item.boardName} ?
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={handleClose}>No</Button>
                <Button color='green' onClick={handleDeleteGame}>Yes</Button>
            </Modal.Actions>
        </Modal>
    );
}

export default DeleteModal;