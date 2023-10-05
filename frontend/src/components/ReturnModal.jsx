import {useState} from 'react';
import {Modal, Button, Table} from 'react-bootstrap';
import {useReturnABookMutation} from '../slices/booksApiSlice';
import {toast} from 'react-toastify';
import Loader from './Loader';

const ReturnModal = ({show, onHide, selectedBook}) => {
    const [returnBook] = useReturnABookMutation();
    const [loading, setLoading] = useState(false);

    const handleReturnBook = async () => {
        try {
            if (!selectedBook) {
                toast.error('Выберите книгу.');
                return;
            }

            setLoading(true);

            const response = await returnBook({
                bookId: selectedBook._id,
                userId: selectedBook.lastEventId?.user?._id,
            });

            setLoading(false);

            if (response.error) {
                toast.error('Ошибка при возврате книги. Попробуйте позже.');
            } else {
                toast.success('Книга успешно возвращена. Обновите страницу.');
                onHide();
            }
        } catch (error) {
            setLoading(false);
            toast.error('Неизвестная ошибка. Попробуйте позже.');
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
                {loading ? (
                    <Loader/>
                ) : (
                    <Button variant="danger" onClick={handleReturnBook} disabled={loading}>
                        Вернуть книгу
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
};

export default ReturnModal;
