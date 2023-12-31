import {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Form, Button, Tabs, Tab, Table} from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import {setCredentials} from '../slices/authSlice';
import {useUpdateUserMutation, useGetUserQuery} from '../slices/usersApiSlice';
import {useBookEventsByUserQuery} from '../slices/eventsApiSlice.js';
import {toast} from 'react-toastify';
import formatDateTime from '../utils/formatDateTime.js';

const ProfileScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmedPassword] = useState('');
    const [booksNotReturned, setBooksNotReturned] = useState([]);

    const dispatch = useDispatch();
    const {userInfo} = useSelector((state) => state.auth);

    const {data: userProfile, isLoading} = useGetUserQuery();
    const [updateProfile, {isLoading: isUpdating}] = useUpdateUserMutation();
    const {
        data: bookEventsData,
        isLoading: isFetchingBookEvents,
    } = useBookEventsByUserQuery(userInfo._id);

    useEffect(() => {
        setName(userInfo.name);
        setEmail(userInfo.email);

        if (bookEventsData && !isFetchingBookEvents) {
            getBooksNotReturned(bookEventsData);
        }
    }, [userInfo.name, userInfo.email, bookEventsData, isFetchingBookEvents]);

    const getBooksNotReturned = (bookEventsData) => {
        const bookIssuedEvents = bookEventsData
            .filter((event) => event.eventType === 'BookIssued');

        const notReturned = bookIssuedEvents
            .filter((issuedEvent) => {
                // Проверяем, есть ли среди событий возврата событие для этой книги
                const hasCorrespondingReturnEvent = bookEventsData.some(
                    (event) =>
                        event.eventType === 'BookReturned' &&
                        event.book._id === issuedEvent.book._id &&
                        new Date(event.createdAt) > new Date(issuedEvent.createdAt)
                );

                return !hasCorrespondingReturnEvent;
            })
            .map((issuedEvent) => ({
                ...issuedEvent.book,
                createdAt: issuedEvent.createdAt,
            }));

        setBooksNotReturned(notReturned);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Пароли не совпадают');
            return;
        }

        try {
            const res = await updateProfile({
                _id: userInfo._id,
                name,
                email,
                password,
            }).unwrap();
            dispatch(setCredentials(res));
            toast.success('Данные сохранены');

            setPassword('');
            setConfirmedPassword('');
        } catch (error) {
            toast.error(error?.data?.message || error.message);
        }
    };

    return (
        <FormContainer>
            <h1 className="mb-4">Профиль</h1>
            {userInfo.isAdmin ? (
                <>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="my-2" controlId="name">
                            <Form.Label>ФИО</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Введите ФИО"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                readOnly
                                disabled
                            />
                        </Form.Group>

                        <Form.Group className="my-2" controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Введите email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="my-2" controlId="password">
                            <Form.Label>Пароль</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Введите пароль"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="my-2" controlId="confirmPassword">
                            <Form.Label>Подтвердите пароль</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Введите пароль"
                                value={confirmPassword}
                                onChange={(e) => setConfirmedPassword(e.target.value)}
                            />
                        </Form.Group>

                        {isUpdating && <Loader/>}

                        <Button type="submit" variant="primary" className="mt-3" disabled={isUpdating}>
                            Сохранить
                        </Button>
                    </Form>
                </>
            ) : (
                <>
                    <Tabs id="profile-tabs" defaultActiveKey="profile" className="mb-3" justify>
                        <Tab eventKey="profile" title="Профиль">
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="my-2" controlId="name">
                                    <Form.Label>ФИО</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Введите ФИО"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        readOnly
                                        disabled
                                    />
                                </Form.Group>

                                <Form.Group className="my-2" controlId="email">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Введите email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group className="my-2" controlId="password">
                                    <Form.Label>Пароль</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Введите пароль"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group className="my-2" controlId="confirmPassword">
                                    <Form.Label>Подтвердите пароль</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Введите пароль"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmedPassword(e.target.value)}
                                    />
                                </Form.Group>

                                {isUpdating && <Loader/>}

                                <Button type="submit" variant="primary" className="mt-3" disabled={isUpdating}>
                                    Сохранить
                                </Button>
                            </Form>
                        </Tab>
                        <Tab eventKey="reader-tickets" title="Читательские билеты и книги">
                            <h4 className='mb-3'>Читательские билеты</h4>
                            {isLoading ? (
                                <Loader/>
                            ) : (
                                <Table striped bordered hover className='mb-4'>
                                    <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Номер билета</th>
                                        <th>Действует до</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {userProfile.readerTicket.ticketNumber !== null ? (
                                        <tr>
                                            <td>1</td>
                                            <td>{userProfile.readerTicket.ticketNumber}</td>
                                            <td>{formatDateTime(userProfile.readerTicket.expirationDate)}</td>
                                        </tr>
                                    ) : (
                                        <tr>
                                            <td colSpan="3">Читательский билет не найден</td>
                                        </tr>
                                    )}
                                    </tbody>
                                </Table>
                            )}
                            <h4 className='mb-3'>Книги на руках</h4>
                            {isFetchingBookEvents ? (
                                <Loader/>
                            ) : (
                                <Table striped bordered hover>
                                    <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Книга</th>
                                        <th>Взята</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {isFetchingBookEvents ? (
                                        <Loader/>
                                    ) : booksNotReturned.length > 0 ? (
                                        booksNotReturned.map((issuedBook, index) => (
                                            <tr key={issuedBook._id}>
                                                <td>{index + 1}</td>
                                                <td>{`${issuedBook.title} (${issuedBook.author})`}</td>
                                                <td>{formatDateTime(issuedBook.createdAt)}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3">У Вас нет книг на руках</td>
                                        </tr>
                                    )}
                                    </tbody>
                                </Table>
                            )}
                        </Tab>
                    </Tabs>
                </>
            )}
        </FormContainer>
    );
};

export default ProfileScreen;
