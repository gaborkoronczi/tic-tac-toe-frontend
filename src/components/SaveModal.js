import React, { useState } from 'react';

import { Button, Modal, Form } from 'semantic-ui-react'

import tictactoe from '../api/tictactoe';

function SaveModal(props) {

    const [modalOpen, setModalOpen] = useState(false);
    const [saveName, setSaveName] = useState("");

    const handleOpen = () => setModalOpen(true)

    const handleClose = () => setModalOpen(false)

    const handleChange = (e) => {
        setSaveName(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if( saveName.length > 0 && saveName.length <= 50 && saveName.search(" ") < 0 && !props.game.isOver) {
            const request = props.board;
            request.boardName = saveName;
            tictactoe.post('/boards', request)
                .then(response => {
                    console.log(response);
                    handleClose();
                })
                .catch(error => {
                    console.log(error);
                    handleClose();
                });
        }
        
    }

    return (
        <Modal open={modalOpen} onClose={handleClose} trigger={<Button disabled={props.disabled} onClick={handleOpen}>Save Game</Button>}>
            <Modal.Header>Save Game</Modal.Header>
            <Modal.Content >
            <Form onSubmit={handleSubmit}>
                <Form.Field>
                    <label>Name</label>
                    <input placeholder='Name' onChange={handleChange} value={saveName} />
                </Form.Field>
                <Button type='submit'>Save</Button>
                <Button type='button' onClick={handleClose}>Close</Button>
            </Form>
            </Modal.Content>
        </Modal>
    );
}

export default SaveModal;