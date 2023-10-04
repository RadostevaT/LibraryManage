import {useState} from 'react';
import {Modal, Button, Table} from 'react-bootstrap';
import {useReturnABookMutation} from "../slices/booksApiSlice";
import {toast} from "react-toastify";

const ReturnModal = ({show, onHide, selectedBook}) => {
    const [returnBook] = useReturnABookMutation();

    const handleReturnBook = async () => {
        try {
            if (!selectedBook) {
                toast.error('Попробуйте обновить страницу');
                return;
            }

            // Выполните запрос на возврат книги, передавая ID книги
            const response = await returnBook({
                bookId: selectedBook._id,
                userId: selectedBook.lastEventId?.user?._id
            });

            // Обработайте успешный ответ и покажите уведомление об успешном возврате
            toast.success('Книга возвращена. Обновите страницу.');

            onHide();
        } catch (error) {
            toast.error('Неизвестная ошибка. Попробуйте обновить страницу.');
        }
    };

    return (
        <Modal size="lg" show={show} onHide={onHide} centered aria-labelledby="contained-modal-title-vcenter">
            <Modal.Header closeButton>
                <Modal.Title>Информация о возврате книги</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Table striped bordered hover responsive className='mb-0'>
                    <thead>
                    <tr>
                        <th>Имя пользователя</th>
                        <th>Книга</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td style={{verticalAlign: 'middle'}}>
                            {selectedBook && selectedBook.lastEventId && selectedBook.lastEventId.user
                                ? `${selectedBook.lastEventId.user.name}`
                                : ''}
                        </td>
                        <td style={{verticalAlign: 'middle'}}>{selectedBook ? `${selectedBook.title} (${selectedBook.author})` : ''}</td>
                    </tr>
                    </tbody>
                </Table>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={handleReturnBook}>
                    Вернуть книгу
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ReturnModal;
