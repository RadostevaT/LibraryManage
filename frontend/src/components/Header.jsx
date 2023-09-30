import {Navbar, Nav, Container, NavDropdown, Badge} from 'react-bootstrap';
import {FaSignInAlt, FaSignOutAlt} from 'react-icons/fa';
import {useSelector, useDispatch} from "react-redux";
import {LinkContainer} from 'react-router-bootstrap';
import {useLogoutMutation} from "../slices/usersApiSlice";
import {logout} from "../slices/authSlice";
import {useNavigate} from "react-router-dom";

const Header = () => {
    const {userInfo} = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [logoutApiCall] = useLogoutMutation();

    const logoutHandler = async () => {
        try {
            await logoutApiCall().unwrap();
            dispatch(logout());
            navigate('/');
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <header>
            <Navbar bg='dark' variant='dark' expand='lg' collapseOnSelect>
                <Container>
                    <LinkContainer to='/'>
                        <Navbar.Brand>Книжный Ассистент</Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls='basic-navbar-nav'/>
                    <Navbar.Collapse id='basic-navbar-nav'>
                        <Nav className='ms-auto'>
                            {userInfo ? (
                                <>
                                    <NavDropdown title={userInfo.name} id='username'>
                                        <LinkContainer to='/profile'>
                                            <NavDropdown.Item>
                                                Профиль
                                            </NavDropdown.Item>
                                        </LinkContainer>
                                        <NavDropdown.Item onClick={logoutHandler}>
                                            Выход
                                        </NavDropdown.Item>
                                    </NavDropdown>
                                </>
                            ) : (
                                <>
                                    <LinkContainer to='/login'>
                                        <Nav.Link>
                                            <FaSignInAlt/> Вход
                                        </Nav.Link>
                                    </LinkContainer>
                                    <LinkContainer to='/register'>
                                        <Nav.Link href='/register'>
                                            <FaSignInAlt/> Регистрация
                                        </Nav.Link>
                                    </LinkContainer>
                                </>
                            )}

                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
};

export default Header;
