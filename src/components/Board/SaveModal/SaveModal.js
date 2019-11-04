import React, { useState } from 'react';

import { useFormik } from 'formik';
import { Button, Modal, Form, Message } from 'semantic-ui-react'

import tictactoe from '../../../utils/api/tictactoe';

function SaveModal(props) {

    const [modalOpen, setModalOpen] = useState(false);
    const [message, setMessage] = useState({ hidden: true, type: "", text: "" });

    const validate = (values) => {
        const errors = {};
        if (!values.name) {
            errors.name = 'Required';
        } else if (values.name.length <= 3 || values.name.length > 50) {
            errors.name = 'Must be between 3 and 50 characters';
        } else if (values.name.search(" ") > 0) {
            errors.name = 'Must not contain any spaces';
        }
        return errors;
    }

    const handleOpen = () => setModalOpen(true)

    const handleClose = () => {
       setModalOpen(false)
       setMessage({...message, hidden: true});
       formik.handleReset();
    }
    

    const handleSubmit = () => {
            const request = props.board;
            request.boardName = formik.values.name;
            tictactoe.post('/boards', request)
                .then(response => {
                    if (response.status === 201) {
                        handleClose();
                        props.setMessage({ hidden: false, type: 'positive', text: `Game saved successfully as ${response.data.boardName}!` })
                    }
                })
                .catch(({response}) => {
                    if (response.status === 409) {
                        setMessage({ hidden: false, type: 'negative', text: `${response.data}` })
                    } else {
                        setMessage({ hidden: false, type: 'negative', text: `Game state is invalid, could not save!`})
                    }
                });
    }

    const formik = useFormik({
        initialValues: {
            name: ''
        },
        validate,
        onSubmit: handleSubmit
    });

    return (
        <Modal open={modalOpen} onClose={handleClose} trigger={<Button disabled={props.disabled} onClick={handleOpen} >Save Game</Button>} size='tiny'>
            <Modal.Header>Save Game</Modal.Header>
            <Modal.Content >
            <Message 
                    hidden={message.hidden}
                    positive={message.type === 'positive' ? true : false}
                    negative={message.type === 'negative' ? true : false}
                    content={message.text}
            />
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

export default SaveModal;