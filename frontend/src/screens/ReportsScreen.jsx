import EventsList from '../components/EventsList.jsx';
import {Button, Pagination, Table, Form, Col, Row} from 'react-bootstrap';
import {useAllEventsMutation} from '../slices/eventsApiSlice.js';
import {useEffect, useState} from 'react';
import Loader from '../components/Loader.jsx';
import {toast} from 'react-toastify';
import formatDateTime from '../utils/formatDateTime.js';
import EventsModal from '../components/EventsModal.jsx';
import DatePicker, {registerLocale} from 'react-datepicker';
import {isWithinInterval} from 'date-fns';
import ru from 'date-fns/locale/ru';
import 'react-datepicker/dist/react-datepicker.css';
import exportToExcel from "../utils/exportFile.js";

const ReportsScreen = () => {
    registerLocale('ru', ru);
    const [fetchAllEvents, {isLoading}] = useAllEventsMutation();
    const [currentPage, setCurrentPage] = useState(1);
    const eventsPerPage = 10;
    const [totalEventsCount, setTotalEventsCount] = useState(0);
    const [eventsData, setEventsData] = useState([]);
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;

    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const [selectedEventType, setSelectedEventType] = useState('all');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchAllEvents().unwrap();
                const arrayOfEvents = Object.values(response);
                setEventsData(arrayOfEvents);
                setTotalEventsCount(arrayOfEvents.length);
            } catch (error) {
                toast.error('Произошла ошибка при загрузке событий.');
            }
        };

        fetchData();
    }, [fetchAllEvents]);

    const eventTypesMapping = {
        TicketCreated: 'Читательский билет выдан',
        TicketUpdated: 'Читательский билет продлен',
        BookIssued: 'Книга выдана',
        BookReturned: 'Книга возвращена',
    };

    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    const filteredEvents =
        selectedEventType === 'all' ? eventsData : eventsData.filter((event) => event.eventType === selectedEventType);

    // Фильтрация событий по выбранному диапазону дат
    const currentEvents = filteredEvents.filter((event) => {
        if (!startDate || !endDate) {
            return true; // Если диапазон дат не выбран, показываем все события
        }
        const eventDate = new Date(event.createdAt);
        return isWithinInterval(eventDate, {start: startDate, end: endDate});
    }).slice(indexOfFirstEvent, indexOfLastEvent);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleFilterChange = (selectedEventType) => {
        setSelectedEventType(selectedEventType);

        // Вычисляем общее количество событий на основе выбранного типа события и дат
        const filteredEvents = filterEventsByTypeAndDate(selectedEventType, startDate, endDate);

        setTotalEventsCount(filteredEvents.length);
        setCurrentPage(1);
    };

    const handleDateChange = (dates) => {
        const [start, end] = dates;
        setDateRange([start, end]);

        // Вычисляем общее количество событий на основе выбранного типа события и дат
        const filteredEvents = filterEventsByTypeAndDate(selectedEventType, start, end);

        setCurrentPage(1);
        setTotalEventsCount(filteredEvents.length);
    };

    // Функция для фильтрации событий по типу и дате
    const filterEventsByTypeAndDate = (eventType, startDate, endDate) => {
        return eventsData.filter((event) => {
            // Фильтрация по типу события
            if (eventType !== 'all' && event.eventType !== eventType) {
                return false;
            }

            // Фильтрация по дате
            if (!startDate || !endDate) {
                return true; // Если диапазон дат не выбран, показываем все события
            }

            const eventDate = new Date(event.createdAt);
            return isWithinInterval(eventDate, {start: startDate, end: endDate});
        });
    };

    // При нажатии кнопки "Скачать в Excel"
    const handleExportToExcel = () => {
        const filteredData = filteredEvents.map((event) => ({
            'Код события': event._id,
            'Время': formatDateTime(event.createdAt),
            'Событие': eventTypesMapping[event.eventType],
            'Книга': event.book ? `${event.book.title} (${event.book.author})` : null,
            'ISBN': event.book ? `${event.book._id}` : null,
            'Читательский билет': event.ticket ? `${event.ticket.ticketNumber}` : null,
            'Пользователь': event.user?.name,
        }));

        // Экспорт в Excel
        exportToExcel(filteredData);
    };

    return (
        <EventsList>
            <h1 className='mb-4'>Отчёты</h1>

            <Row className='mb-4'>
                <Col>
                    <Form.Select
                        value={selectedEventType}
                        onChange={(e) => handleFilterChange(e.target.value)}
                    >
                        <option value='all'>Все события</option>
                        <option value='TicketCreated'>Читательский билет выдан</option>
                        <option value='TicketUpdated'>Читательский билет продлен</option>
                        <option value='BookIssued'>Книга выдана</option>
                        <option value='BookReturned'>Книга возвращена</option>
                    </Form.Select>
                </Col>

                <Col>
                    <Form.Group className='w-100'>
                        <DatePicker
                            locale='ru'
                            isClearable
                            selectsRange={true}
                            startDate={startDate}
                            endDate={endDate}
                            onChange={handleDateChange}
                            dateFormat='dd.MM.yyyy'
                            placeholderText='Выберите дату'
                            className='form-control'
                            wrapperClassName='w-100'
                        />
                    </Form.Group>
                </Col>

                <Col xs={12} lg={3} className={`${window.innerWidth <= 991 ? 'mt-3' : ''}`}>
                    <Button className='w-100' onClick={handleExportToExcel}>
                        Скачать в Excel
                    </Button>
                </Col>
            </Row>

            <Table striped bordered hover responsive className='mb-4'>
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
                            <Button variant='outline-primary' onClick={() => {
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

            <Pagination size={`${window.innerWidth <= 576 ? 'sm' : ''}`}>
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
