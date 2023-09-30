import React, {useEffect, useState} from 'react';
import {Button, Table, Pagination, Form, InputGroup} from 'react-bootstrap';
import ReadersList from '../components/ReadersList';
import {useFetchUsersMutation, useSearchUsersMutation} from '../slices/usersApiSlice';
import {toast} from 'react-toastify';
import TicketsModal from '../components/TicketsModal';

const TicketsScreen = () => {
    const [usersList, {isLoading}] = useFetchUsersMutation();
    const [usersData, setUsersData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;
    const [totalUsersCount, setTotalUsersCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    const [modalShow, setModalShow] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const [searchUsers] = useSearchUsersMutation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await usersList({query: searchQuery}).unwrap();
                const arrayOfUsers = Object.values(response);
                setUsersData(arrayOfUsers);
                setTotalUsersCount(arrayOfUsers.length);
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        };

        fetchData();
    }, [usersList, searchQuery]);


    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = usersData.slice(indexOfFirstUser, indexOfLastUser);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleSearch = async () => {
        try {
            setCurrentPage(1);

            const response = await searchUsers(searchQuery).unwrap();
            await response;
            const arrayOfUsers = Object.values(response);
            setUsersData(arrayOfUsers);
            setTotalUsersCount(arrayOfUsers.length);
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <ReadersList>
            <h1 className="mb-4">Список читателей</h1>

            <InputGroup className="mb-3">
                <Form.Control
                    placeholder="Поиск по имени"
                    aria-label="Поиск по имени"
                    aria-describedby="basic-addon2"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <Button variant="outline-secondary" id="button-addon2" onClick={handleSearch}>
                    Поиск
                </Button>
            </InputGroup>
            <Table striped bordered hover responsive className="mb-4">
                <thead>
                <tr>
                    <th>#</th>
                    <th>Пользователь</th>
                    <th>Читательский билет</th>
                    <th>Действия</th>
                </tr>
                </thead>
                <tbody>
                {currentUsers.map((user, index) => (
                    <tr key={user._id}>
                        <td style={{verticalAlign: 'middle'}}>{indexOfFirstUser + index + 1}</td>
                        <td style={{verticalAlign: 'middle'}}>{user.name}</td>
                        <td style={{verticalAlign: 'middle'}}>{user.readerTicket ? user.readerTicket.ticketNumber : 'Нет'}</td>
                        <td>
                            <Button variant="outline-primary" onClick={() => {
                                setSelectedUser(user);
                                setModalShow(true)
                            }
                            }>
                                Подробнее
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
            <TicketsModal show={modalShow} onHide={() => setModalShow(false)} userData={selectedUser}/>

            {isLoading}

            <Pagination>
                <Pagination.First onClick={() => handlePageChange(1)}/>
                <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}/>
                {Array.from({length: Math.ceil(totalUsersCount / usersPerPage)}, (_, i) => (
                    <Pagination.Item
                        key={i + 1}
                        active={i + 1 === currentPage}
                        onClick={() => handlePageChange(i + 1)}
                    >
                        {i + 1}
                    </Pagination.Item>
                ))}
                <Pagination.Next
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === Math.ceil(totalUsersCount / usersPerPage)}
                />
                <Pagination.Last
                    onClick={() => handlePageChange(Math.ceil(totalUsersCount / usersPerPage))}
                />
            </Pagination>

        </ReadersList>
    );
};

export default TicketsScreen;