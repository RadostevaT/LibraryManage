import {Container} from "react-bootstrap";

const EventsList = ({children}) => {
    return (
        <Container className='justify-content-md-center mt-5'>
            {children}
        </Container>
    )
}

export default EventsList;
