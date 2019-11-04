import React, { useState, useContext } from 'react';

import { useFormik } from 'formik';
import { Button, Modal, Form, Message } from 'semantic-ui-react'

import Board from '../../Board/Board';
import tictactoe from '../../../utils/api/tictactoe';
import { USER_SYMBOL, COMPUTER_SYMBOL } from '../../../utils/const';
import { ListOfGamesContext } from '../../../contexts';

function EditModal(props) {
    const [modalOpen, setModalOpen] = useState(false);
    const [message, setMessage] = useState({ hidden: true, type: "", text: "" });
    const [board, setBoard] = useState(props.item);
    const { listOfGames, setListOfGames } = useContext(ListOfGamesContext);
    
    const validate = (values) => {
        const errors = {};
        if (!values.name) {
            errors.name = 'Required';
        } else if (values.name.length <= 3 || values.name.length > 50) {
            errors.name = 'Must be between 3 and 50 characters';
        } else if (values.name.search(" ") >= 0) {
            errors.name = 'Must not contain any spaces';
        }
        return errors;
    }

    const handleEdit = (row, col, value) => {
        switch(value) {
            case USER_SYMBOL:
                setBoard({...board, usersCells: board.usersCells.concat({ row, col })})
                break;
            case COMPUTER_SYMBOL:
                setBoard({
                    ...board,
                    usersCells: board.usersCells.filter(item => { return !(item.row === row && item.col === col) }),
                    computersCells: board.computersCells.concat({ row, col})
                })
                break;
            default:
                setBoard({...board, computersCells: board.computersCells.filter(item => { return !(item.row === row && item.col === col) })});
        }
    }

    const handleOpen = () => setModalOpen(true)

    const handleClose = () => {
       setModalOpen(false)
       setMessage({...message, hidden: true});
       setBoard(props.item);
       formik.handleReset();
    }
    
    const handleSubmit = () => {
            const request = board;
            request.boardName = formik.values.name;
            tictactoe.put(`/boards/${board.id}`, request)
                .then(response => {
                    if (response.status === 200) {
                        setListOfGames(
                            listOfGames.map(item => {
                                if (item.id === board.id) {
                                    return board;
                                } else {
                                    return item;
                                }
                            })
                        )
                        handleClose();
                        props.setMessage({ hidden: false, type: 'positive', text: `${response.data.boardName} edited successfully!` });
                    }
                })
                .catch(({response}) => {
                    if (response.status === 409) {
                        setMessage({ hidden: false, type: 'negative', text: `${response.data}` });
                    } else {
                        setMessage({ hidden: false, type: 'negative', text: `Game state is invalid, could not save!`});
                    }
                });
    }

    const formik = useFormik({
        initialValues: {
            name: props.item.boardName
        },
        validate,
        onSubmit: handleSubmit,
        enableReinitialize: true
    });
    
    return (
        <Modal open={modalOpen} onClose={handleClose} trigger={<Button basic color='yellow' onClick={handleOpen} >Edit</Button>} size='tiny'>
            <Modal.Header>Edit Game</Modal.Header>
            <Modal.Content >
            <Message 
                    hidden={message.hidden}
                    positive={message.type === 'positive' ? true : false}
                    negative={message.type === 'negative' ? true : false}
                    content={message.text}
            />
            <Board editHandler={handleEdit} board={board} />
            <Form onSubmit={formik.handleSubmit}>
                <Form.Input
                    label='Name'
                    placeholder='Name'
                    name='name'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.name && formik.errors.name ? formik.errors.name : false}
                    value={formik.values.name}
                />
                
                <Button type='submit' positive disabled={formik.isSubmitting}>Save</Button>
                <Button type='reset' onClick={handleClose}>Cancel</Button>
            </Form>
            </Modal.Content>
        </Modal>
    );
}

export default EditModal;