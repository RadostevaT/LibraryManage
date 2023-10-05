import EventsList from "../components/EventsList.jsx";
import {Button, Pagination, Table, Form} from "react-bootstrap";
import {useAllEventsMutation} from "../slices/eventsApiSlice.js";
import {useEffect, useState} from "react";
import Loader from "../components/Loader.jsx";
import {toast} from "react-toastify";
import formatDateTime from "../utils/formatDateTime.js";
import EventsModal from "../components/EventsModal.jsx";

const ReportsScreen = () => {
    const [fetchAllEvents, {isLoading}] = useAllEventsMutation();
    const [currentPage, setCurrentPage] = useState(1);
    const eventsPerPage = 10;
    const [totalEventsCount, setTotalEventsCount] = useState(0);
    const [eventsData, setEventsData] = useState([]);

    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const [selectedEventType, setSelectedEventType] = useState("all");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchAllEvents().unwrap();
                const arrayOfEvents = Object.values(response);
                setEventsData(arrayOfEvents);
                setTotalEventsCount(arrayOfEvents.length);
            } catch (error) {
                toast.error("Произошла ошибка при загрузке событий.");
            }
        };

        fetchData();
    }, [fetchAllEvents]);

    const eventTypesMapping = {
        TicketCreated: 'Читательский билет выдан',
        TicketUpdated: 'Читательский билет продлен',
        BookIssued: 'Книга выдана',
        BookReturned: 'Книга возвращена'
    };

    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    const filteredEvents = selectedEventType === "all"
        ? eventsData
        : eventsData.filter(event => event.eventType === selectedEventType);
    const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);

    const handleFilterChange = (selectedEventType) => {
        setSelectedEventType(selectedEventType);

        const filteredEvents = eventsData.filter(event => event.eventType === selectedEventType);
        setTotalEventsCount(filteredEvents.length);
        setCurrentPage(1);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <EventsList>
            <h1 className='mb-4'>Отчёты</h1>

            <Form.Select
                className='mb-4'
                value={selectedEventType}
                onChange={(e) => handleFilterChange(e.target.value)}
            >
                <option value="all">Все события</option>
                <option value="TicketCreated">Читательский билет выдан</option>
                <option value="TicketUpdated">Читательский билет продлен</option>
                <option value="BookIssued">Книга выдана</option>
                <option value="BookReturned">Книга возвращена</option>
            </Form.Select>

            <Table striped bordered hover responsive className="mb-4">
                <thead>
                <tr>
                    <th>#</th>
                    <th>Время</th>
                    <th>Событие</th>
                    <th>Пользователь</th>
                    <th>Действия</th>
                </tr>
                </thead>
                <tbody>
                {currentEvents.map((event, index) => (
                    <tr key={event._id}>
                        <td>{indexOfFirstEvent + index + 1}</td>
                        <td>{formatDateTime(event.createdAt)}</td>
                        <td>{eventTypesMapping[event.eventType]}</td>
                        <td>{event.user?.name}</td>
                        <td>
                            <Button variant="outline-primary" onClick={() => {
                                setSelectedEvent(event);
                                setShowModal(true);
                            }}>
                                Подробнее
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
            <EventsModal
                show={showModal}
                onHide={() => setShowModal(false)}
                event={selectedEvent}
            />

            {isLoading && <Loader/>}

            <Pagination>
                <Pagination.First onClick={() => handlePageChange(1)}/>
                <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}/>
                {Array.from({length: Math.ceil(totalEventsCount / eventsPerPage)}, (_, i) => (
                    <Pagination.Item
                        key={i + 1}
                        active={i + 1 === currentPage}
                        onClick={() => handlePageChange(i + 1)}>
                        {i + 1}
                    </Pagination.Item>
                ))}
                <Pagination.Next
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === Math.ceil(totalEventsCount / eventsPerPage)}
                />
                <Pagination.Last
                    onClick={() => handlePageChange(Math.ceil(totalEventsCount / eventsPerPage))}
                />
            </Pagination>

        </EventsList>
    );
};

export default ReportsScreen;
