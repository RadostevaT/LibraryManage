import {useState, useEffect} from 'react';
import BooksList from '../components/BooksList';
import {useListOfBooksMutation, useSearchBooksMutation} from '../slices/booksApiSlice';
import {toast} from 'react-toastify';
import {Table, Pagination, InputGroup, Form, Button} from 'react-bootstrap';
import Loader from '../components/Loader.jsx';

const BooksScreen = () => {
    const [booksList, {isLoading}] = useListOfBooksMutation();
    const [searchBooks] = useSearchBooksMutation();

    const [booksData, setBooksData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const booksPerPage = 10;
    const [totalBooksCount, setTotalBooksCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [tempSearchQuery, setTempSearchQuery] = useState('');

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

    return (
        <BooksList>
            <h1 className='mb-4'>Каталог книг</h1>

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

            <Table striped bordered hover responsive className='mb-4'>
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
            </Table>

            {isLoading && <Loader/>}

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
    );
};

export default BooksScreen;
