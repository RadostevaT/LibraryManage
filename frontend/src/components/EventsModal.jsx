import {Modal, Button, ListGroup} from "react-bootstrap";
import formatDateTime from "../utils/formatDateTime.js";

function EventsModal({show, onHide, event}) {
    // Если данных о событии нет, не отрисовываем модальное окно
    if (!event) {
        return null;
    }

    // Маппинг типов событий на текстовое описание
    const eventTypesMapping = {
        TicketCreated: 'Читательский билет выдан',
        TicketUpdated: 'Читательский билет продлен',
        BookIssued: 'Книга выдана',
        BookReturned: 'Книга возвращена'
    };

    return (
        <Modal size="lg" show={show} onHide={onHide} centered aria-labelledby="contained-modal-title-vcenter">
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Информация о событии №{event._id}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="grid-example">
                {/* Отображение информации о событии, если оно связано с книгой */}
                {event.eventType.startsWith('Book') && (
                    <ListGroup>
                        <ListGroup.Item>ISBN: {event.book._id}</ListGroup.Item>
                        <ListGroup.Item>Книга: {event.book.title} ({event.book.author})</ListGroup.Item>
                        <ListGroup.Item>Читатель: {event.user.name}</ListGroup.Item>
                        <ListGroup.Item>Тип события: {eventTypesMapping[event.eventType]}</ListGroup.Item>
                        <ListGroup.Item>Время события: {formatDateTime(event.createdAt)}</ListGroup.Item>
                    </ListGroup>
                )}

                {/* Отображение информации о событии, если оно связано с читательским билетом */}
                {event.eventType.startsWith('Ticket') && (
                    <ListGroup>
                        <ListGroup.Item>Читательский билет: №{event.user.readerTicket.ticketNumber}</ListGroup.Item>
                        <ListGroup.Item>Читатель: {event.user.name}</ListGroup.Item>
                        <ListGroup.Item>Тип события: {eventTypesMapping[event.eventType]}</ListGroup.Item>
                        <ListGroup.Item>Время события: {formatDateTime(event.createdAt)}</ListGroup.Item>
                    </ListGroup>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onHide}>Закрыть</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default EventsModal;
