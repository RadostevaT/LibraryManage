import {useState} from 'react';
import {Modal, Button, Table} from 'react-bootstrap';
import {useReturnABookMutation} from '../slices/booksApiSlice';
import {toast} from 'react-toastify';

const ReturnModal = ({show, onHide, selectedBook, onModalSuccess}) => {
    const [returnBook] = useReturnABookMutation();
    const [loading, setLoading] = useState(false);

    const handleReturnBook = async () => {
        try {
            setLoading(true);

            if (!selectedBook) {
                toast.error('Выберите книгу.');
                return;
            }

            const response = await returnBook({
                bookId: selectedBook._id,
                userId: selectedBook.lastEventId?.user?._id,
            });

            if (response.error) {
                toast.error('Ошибка при возврате книги. Попробуйте позже.');
            } else {
                toast.success('Книга успешно возвращена.');
                await onModalSuccess();
                onHide();
            }
        } catch (error) {
            toast.error('Неизвестная ошибка. Попробуйте позже.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            size="lg"
            show={show}
            onHide={onHide}
            centered
            aria-labelledby="contained-modal-title-vcenter"
        >
            <Modal.Header closeButton>
                <Modal.Title>Информация о возврате книги</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Table striped bordered hover responsive className="mb-0">
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
                        <td style={{verticalAlign: 'middle'}}>
                            {selectedBook ? `${selectedBook.title} (${selectedBook.author})` : ''}
                        </td>
                    </tr>
                    </tbody>
                </Table>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={handleReturnBook} disabled={loading}>
                    Вернуть книгу
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ReturnModal;
