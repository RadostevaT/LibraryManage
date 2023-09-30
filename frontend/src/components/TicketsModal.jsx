import React from 'react';
import {Button, Modal, ListGroup} from 'react-bootstrap';
import formatDateTime from "../utils/formatDateTime";
import {useExtendTicketMutation, useCreateTicketMutation} from "../slices/ticketsApiSlice";
import {toast} from "react-toastify";

function TicketsModal({show, onHide, userData}) {
    const [extendTicket] = useExtendTicketMutation();
    const [createTicket] = useCreateTicketMutation();

    if (!userData) {
        return null; // Если данных нет, не отрисовываем модальное окно
    }

    const hasReaderTicket = userData.readerTicket;

    const handleExtendTicket = async () => {
        try {
            const {readerTicket} = userData;
            const {ticketNumber} = readerTicket;

            await extendTicket({ticketNumber: ticketNumber});

            toast.success('Билет успешно продлен');

            onHide();
        } catch (error) {
            toast.error('Ошибка при продлении билета');
        }
    };

    const handleCreateTicket = async () => {
        try {
            const {email} = userData;

            await createTicket({email: email});

            toast.success('Билет успешно выдан');

            onHide();
        } catch (error) {
            toast.error('Ошибка при создании билета');
        }
    };

    return (
        <Modal size="lg" show={show} onHide={onHide} centered aria-labelledby="contained-modal-title-vcenter">
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {userData.name}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="grid-example">
                <ListGroup>
                    <ListGroup.Item>Имя: {userData.name}</ListGroup.Item>
                    <ListGroup.Item>Email: {userData.email}</ListGroup.Item>
                    <ListGroup.Item>
                        {hasReaderTicket && (
                            <span>Читательский билет: №{userData.readerTicket.ticketNumber}</span>
                        )}
                        {!hasReaderTicket && (
                            <span>Читательский билет: Нет</span>
                        )}
                    </ListGroup.Item>
                    {hasReaderTicket && (
                        <>
                            <ListGroup.Item>Дата
                                выдачи: {formatDateTime(userData.readerTicket.dateIssued)}</ListGroup.Item>
                            <ListGroup.Item>Срок
                                действия: {formatDateTime(userData.readerTicket.expirationDate)}</ListGroup.Item>
                        </>
                    )}
                </ListGroup>
            </Modal.Body>
            <Modal.Footer>
                {hasReaderTicket ? (
                    <Button variant="success" onClick={handleExtendTicket}>
                        Продлить
                    </Button>
                ) : (
                    <Button variant="success" onClick={handleCreateTicket}>
                        Выдать
                    </Button>
                )}
                <Button onClick={onHide}>Закрыть</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default TicketsModal;
