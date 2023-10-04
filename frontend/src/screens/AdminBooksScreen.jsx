import {useState, useEffect} from 'react';
import BooksList from '../components/BooksList';
import {
    useListOfBooksMutation,
    useSearchBooksMutation,
} from '../slices/booksApiSlice';
import {toast} from 'react-toastify';
import {Table, Pagination, InputGroup, Form, Button} from 'react-bootstrap';
import BookModal from '../components/BookModal.jsx';
import IssueModal from '../components/IssueModal.jsx';
import ReturnModal from "../components/ReturnModal.jsx";

const AdminBooksScreen = () => {
    // Мутации для получения списка книг, поиска и выдачи книги
    const [booksList, {isLoading}] = useListOfBooksMutation();
    const [searchBooks] = useSearchBooksMutation();

    // Состояния для хранения данных о книгах, текущей странице и поискового запроса
    const [booksData, setBooksData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const booksPerPage = 10;
    const [totalBooksCount, setTotalBooksCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    // Состояния для модальных окон
    const [modalShow, setModalShow] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [issueModalShow, setIssueModalShow] = useState(false);
    const [returnModalShow, setReturnModalShow] = useState(false);

    useEffect(() => {
        // Функция для получения списка книг
        const fetchData = async () => {
            try {
                const response = await booksList({query: searchQuery}).unwrap();
                const arrayOfBooks = Object.values(response.data);
                setBooksData(arrayOfBooks);
                setTotalBooksCount(arrayOfBooks.length);
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        };

        fetchData();
    }, [booksList, searchQuery]);

    // Вычисление индексов первой и последней книги на текущей странице
    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    const currentBooks = booksData.slice(indexOfFirstBook, indexOfLastBook);

    // Обработчик смены страницы
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Обработчик поискового запроса
    const handleSearch = async () => {
        try {
            setCurrentPage(1);

            const response = await searchBooks(searchQuery).unwrap();
            const arrayOfBooks = Object.values(response.data);

            if (arrayOfBooks.length === 0) {
                toast.info('Книги не найдены.');
            }
            setBooksData(arrayOfBooks);
            setTotalBooksCount(arrayOfBooks.length);
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    // Обработчик нажатия клавиши Enter
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    // Обработчик выбора книги для выдачи
    function handleIssue(bookId, isAvailable) {
        setSelectedBook({_id: bookId, available: isAvailable});
        setIssueModalShow(true);
    };

    //
    function handleReturn(bookId, title, author, isAvailable, lastEventId) {
        setSelectedBook({
            _id: bookId,
            title: title,
            author: author,
            available: isAvailable,
            lastEventId: lastEventId
        });
        setReturnModalShow(true);
    }

    return (
        <BooksList>
            <h1 className='mb-4'>Каталог книг</h1>
            <InputGroup className="mb-3">
                <Form.Control
                    placeholder="Поиск по названию или автору"
                    aria-label="Поиск по названию или автору"
                    aria-describedby="basic-addon2"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <Button variant="outline-secondary" id="button-addon2" onClick={handleSearch}>
                    Поиск
                </Button>
            </InputGroup>
            <Table striped bordered hover responsive className='mb-4'>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Название</th>
                    <th>Автор</th>
                    <th>В наличии</th>
                    <th>Действия</th>
                </tr>
                </thead>
                <tbody>
                {currentBooks.map((book, index) => (
                    <tr key={book._id}>
                        <td style={{verticalAlign: 'middle'}}>{index + 1 + (currentPage - 1) * booksPerPage}</td>
                        <td style={{verticalAlign: 'middle'}}>{book.title}</td>
                        <td style={{verticalAlign: 'middle'}}>{book.author}</td>
                        <td style={{verticalAlign: 'middle'}}>{book.available ? 'Да' : 'Нет'}</td>
                        <td style={{verticalAlign: 'middle'}}>
                            <Button variant="outline-primary" onClick={() => {
                                setSelectedBook(book);
                                setModalShow(true);
                            }}>
                                Подробнее
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
            <BookModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                bookData={selectedBook}
                onAction={selectedBook && selectedBook.available ? handleIssue : handleReturn}
            />

            <IssueModal
                show={issueModalShow}
                onHide={() => setIssueModalShow(false)}
                selectedBook={selectedBook}
            />

            <ReturnModal
                show={returnModalShow}
                onHide={() => setReturnModalShow(false)}
                selectedBook={selectedBook}
            />

            {isLoading}

            <Pagination>
                <Pagination.First onClick={() => handlePageChange(1)}/>
                <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}/>
                {Array.from({length: Math.ceil(totalBooksCount / booksPerPage)}, (_, i) => (
                    <Pagination.Item
                        key={i + 1}
                        active={i + 1 === currentPage}
                        onClick={() => handlePageChange(i + 1)}>
                        {i + 1}
                    </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => handlePageChange(currentPage + 1)}
                                 disabled={currentPage === Math.ceil(totalBooksCount / booksPerPage)}/>
                <Pagination.Last onClick={() => handlePageChange(Math.ceil(totalBooksCount / booksPerPage))}/>
            </Pagination>
        </BooksList>
    )
}

export default AdminBooksScreen;
