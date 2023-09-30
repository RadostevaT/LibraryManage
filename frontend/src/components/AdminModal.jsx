import React from 'react';
import {Button, Modal, ListGroup} from 'react-bootstrap';

function AdminModal({show, onHide, bookData, onAction}) {
    if (!bookData) {
        return null; // Если данных нет, не отрисовываем модальное окно
    }

    const handleAction = () => {
        onHide(); // Закрыть модальное окно
        onAction(bookData.id, bookData.available); // Вызвать функцию onAction с идентификатором книги и флагом доступности
    };

    return (
        <Modal size="lg" show={show} onHide={onHide} centered aria-labelledby="contained-modal-title-vcenter">
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {bookData.title} ({bookData.author})
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="grid-example">
                <ListGroup>
                    <ListGroup.Item>Автор: {bookData.author}</ListGroup.Item>
                    <ListGroup.Item>Год публикации: {bookData.publishYear}</ListGroup.Item>
                    <ListGroup.Item>Шкаф: {bookData.idShelf}</ListGroup.Item>
                    <ListGroup.Item>Полка: {bookData.idRack}</ListGroup.Item>
                    <ListGroup.Item>В наличии: {bookData.available ? 'Да' : 'Нет'}</ListGroup.Item>
                </ListGroup>
            </Modal.Body>
            <Modal.Footer>
                {bookData.available ? (
                    <Button variant="success" onClick={handleAction}>
                        Выдать
                    </Button>
                ) : (
                    <Button variant="danger" onClick={handleAction}>
                        Вернуть
                    </Button>
                )}
                <Button onClick={onHide}>Закрыть</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default AdminModal;
