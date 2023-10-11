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
import ReturnModal from '../components/ReturnModal.jsx';
import Loader from '../components/Loader.jsx';
import {useSelector} from "react-redux";

const BooksScreen = () => {
    // Определение мутаций для получения и поиска книг
    const [booksList, {isLoading}] = useListOfBooksMutation();
    const [searchBooks] = useSearchBooksMutation();

    // Состояния для хранения данных о книгах, текущей странице и поискового запроса
    const [booksData, setBooksData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const booksPerPage = 10;
    const [totalBooksCount, setTotalBooksCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [tempSearchQuery, setTempSearchQuery] = useState('');

    // Состояния для модальных окон
    const [modalShow, setModalShow] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [issueModalShow, setIssueModalShow] = useState(false);
    const [returnModalShow, setReturnModalShow] = useState(false);

    const {userInfo} = useSelector((state) => state.auth);

    useEffect(() => {
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

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleInputChange = (e) => {
        setTempSearchQuery(e.target.value); // Сохраняем временное значение
    };

    const handleSearch = async () => {
        try {
            setCurrentPage(1);

            const response = await searchBooks(tempSearchQuery).unwrap();
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

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    const handleModalSuccess = async () => {
        try {
            const response = await booksList({query: searchQuery}).unwrap();
            const arrayOfBooks = Object.values(response.data);
            setBooksData(arrayOfBooks);
            setTotalBooksCount(arrayOfBooks.length);
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    // Обработчик выбора книги для выдачи
    function handleIssue(bookId, isAvailable) {
        setSelectedBook({_id: bookId, available: isAvailable});
        setIssueModalShow(true);
    }

    // Обработчик выбора книги для возврата
    function handleReturn(bookId, title, author, isAvailable, lastEventId) {
        setSelectedBook({
            _id: bookId,
            title: title,
            author: author,
            available: isAvailable,
            lastEventId: lastEventId,
        });
        setReturnModalShow(true);
    }

    return (
        <BooksList>
            <h1 className="mb-4">Каталог книг</h1>

            <InputGroup className="mb-3">
                <Form.Control
                    placeholder="Поиск по названию или автору"
                    aria-label="Поиск по названию или автору"
                    aria-describedby="basic-addon2"
                    value={tempSearchQuery}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                />
                <Button variant="outline-secondary" id="button-addon2" onClick={handleSearch}>
                    Поиск
                </Button>
            </InputGroup>

            <Table striped bordered hover responsive className="mb-4">
                {userInfo ? (
                    <>
                        {userInfo.isAdmin ? (
                            <>
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
                            </>
                        ) : (
                            <>
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Название</th>
                                    <th>Автор</th>
                                    <th>Год публикации</th>
                                    <th>В наличии</th>
                                </tr>
                                </thead>
                                <tbody>
                                {currentBooks.map((book, index) => (
                                    <tr key={book._id}>
                                        <td style={{verticalAlign: 'middle'}}>{index + 1 + (currentPage - 1) * booksPerPage}</td>
                                        <td style={{verticalAlign: 'middle'}}>{book.title}</td>
                                        <td style={{verticalAlign: 'middle'}}>{book.author}</td>
                                        <td style={{verticalAlign: 'middle'}}>{book.publishYear}</td>
                                        <td style={{verticalAlign: 'middle'}}>{book.available ? 'Да' : 'Нет'}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </>
                        )}
                    </>
                ) : (
                    <>
                        {toast.error('Что-то пошло не так')}
                    </>
                )}
            </Table>

            {/* Модальное окно для книги */}
            <BookModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                bookData={selectedBook}
                onAction={selectedBook && selectedBook.available ? handleIssue : handleReturn}
            />

            {/* Модальное окно для выдачи книги */}
            <IssueModal
                show={issueModalShow}
                onHide={() => setIssueModalShow(false)}
                selectedBook={selectedBook}
                onModalSuccess={handleModalSuccess}
            />

            {/* Модальное окно для возврата книги */}
            <ReturnModal
                show={returnModalShow}
                onHide={() => setReturnModalShow(false)}
                selectedBook={selectedBook}
                onModalSuccess={handleModalSuccess}
            />

            {
                isLoading && <Loader/>
            }

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

export default BooksScreen;
