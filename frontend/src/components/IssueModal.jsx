import {useState} from 'react';
import {Modal, Button, Form, InputGroup, Table, ButtonGroup, ToggleButton} from 'react-bootstrap';
import {FaPlus} from 'react-icons/fa';
import {useSearchUsersMutation} from '../slices/usersApiSlice.js';
import {useIssueABookMutation} from '../slices/booksApiSlice.js';
import {toast} from 'react-toastify';
import Loader from "./Loader.jsx";

const IssueModal = ({show, onHide, selectedBook, onModalSuccess}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    const [isLoading, setIsLoading] = useState(false);

    const [searchUsers] = useSearchUsersMutation();
    const [issueABook] = useIssueABookMutation();

    const handleSearch = async () => {
        try {
            setIsLoading(true);

            const response = await searchUsers(searchQuery).unwrap();
            const arrayOfUsers = Object.values(response);
            setSearchResults(arrayOfUsers);

            if (arrayOfUsers.length == 0) {
                toast.info('Пользователи не найдены.')
            }
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleIssueBook = async () => {
        if (!selectedUserId) {
            toast.error('Пожалуйста, выберите пользователя');
            onHide();
            return;
        }

        if (selectedUser.readerTicket.ticketNumber === null) {
            toast.error('У пользователя отсутствует читательский билет');
            onHide();
            return;
        }

        const currentDateTime = new Date();

        if (new Date(selectedUser.readerTicket.expirationDate) < currentDateTime) {
            toast.error('У пользователя отсутствует действительный читательский билет');
            onHide();
            return;
        }

        try {
            setIsLoading(true);

            await issueABook({bookId: selectedBook._id, userId: selectedUserId});
            toast.success('Книга успешно выдана.');

            await onModalSuccess();

            onHide();
        } catch (error) {
            toast.error('Ошибка при выдаче книги');
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <Modal size="lg" show={show} onHide={onHide} centered aria-labelledby="contained-modal-title-vcenter">
            <Modal.Header closeButton>
                <Modal.Title>Выберите пользователя</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <InputGroup className="mb-3">
                    <Form.Control
                        placeholder="Поиск по имени или номеру читательского билета"
                        aria-label="Поиск по имени или номеру читательского билета"
                        aria-describedby="basic-addon2"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <Button variant="outline-secondary" id="button-addon2" onClick={handleSearch}>
                        Поиск
                    </Button>
                </InputGroup>
                {isLoading ? (
                    <Loader/>
                ) : (
                    <Table striped bordered hover responsive className='mb-0'>
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Имя</th>
                            <th>Читательский билет</th>
                            <th>Выбрать</th>
                        </tr>
                        </thead>
                        <tbody>
                        {searchResults.slice(0, 10).map((user, index) => (
                            <tr key={user._id}>
                                <td style={{verticalAlign: 'middle'}}>{index + 1}</td>
                                <td style={{verticalAlign: 'middle'}}>{user.name}</td>
                                <td style={{verticalAlign: 'middle'}}>
                                    {user.readerTicket.ticketNumber !== null ?
                                        user.readerTicket.ticketNumber
                                        :
                                        <FaPlus style={{color: '#dc3545', transform: 'rotate(45deg)'}} size={20}/>
                                    }
                                </td>
                                <td style={{verticalAlign: 'middle'}}>
                                    <ButtonGroup>
                                        <ToggleButton
                                            type='radio'
                                            variant={selectedUserId === user._id ? 'primary' : 'outline-primary'}
                                            id={`user-radio-${user._id}`}
                                            name='selectedUser'
                                            onChange={() => {
                                                setSelectedUserId(user._id);
                                                setSelectedUser(user);
                                            }}
                                        >
                                            Выбрать
                                        </ToggleButton>
                                    </ButtonGroup>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={handleIssueBook} disabled={isLoading}>
                    Выдать
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default IssueModal;
