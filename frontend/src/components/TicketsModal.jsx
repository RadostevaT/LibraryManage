import {useState} from 'react';
import {Button, Modal, ListGroup} from 'react-bootstrap';
import formatDateTime from '../utils/formatDateTime';
import {useExtendTicketMutation, useCreateTicketMutation} from '../slices/ticketsApiSlice';
import {toast} from 'react-toastify';
import Loader from './Loader';

function TicketsModal({show, onHide, userData, onModalSuccess}) {
    const [extendTicket] = useExtendTicketMutation();
    const [createTicket] = useCreateTicketMutation();
    const [isLoading, setIsLoading] = useState(false);

    if (!userData) {
        return null;
    }

    const hasReaderTicket = userData.readerTicket;

    const handleExtendTicket = async () => {
        try {
            const {readerTicket} = userData;
            const {ticketNumber} = readerTicket;

            setIsLoading(true);

            await extendTicket({ticketNumber: ticketNumber});

            await onModalSuccess();

            setIsLoading(false);

            toast.success('Билет успешно продлен');

            onHide();
        } catch (error) {
            setIsLoading(false);

            toast.error('Ошибка при продлении билета');
        }
    };

    const handleCreateTicket = async () => {
        try {
            const {email} = userData;

            setIsLoading(true);

            await createTicket({email: email});

            await onModalSuccess();

            setIsLoading(false);

            toast.success('Билет успешно выдан');

            onHide();
        } catch (error) {
            setIsLoading(false);

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
                        {hasReaderTicket ? (
                            <span>Читательский билет: №{userData.readerTicket.ticketNumber}</span>
                        ) : (
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
                    <Button variant="success" onClick={handleExtendTicket} disabled={isLoading}>
                        Продлить
                    </Button>
                ) : (
                    <Button variant="success" onClick={handleCreateTicket} disabled={isLoading}>
                        Выдать
                    </Button>
                )}
                <Button onClick={onHide}>Закрыть</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default TicketsModal;
