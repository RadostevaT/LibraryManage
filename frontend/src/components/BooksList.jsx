import {Container} from "react-bootstrap";

const BooksList = ({children}) => {
    return (
        <Container className='justify-content-md-center mt-5'>
            {children}
        </Container>
    )
}

export default BooksList;
