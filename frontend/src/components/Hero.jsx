import {Container, Card, Button} from 'react-bootstrap';
import {LinkContainer} from "react-router-bootstrap";
import {useSelector} from "react-redux";

const Hero = () => {
    const {userInfo} = useSelector((state) => state.auth);

    return (
        <div className='py-5'>
            <Container className='d-flex justify-content-center'>
                <Card className='p-5 d-flex flex-column align-items-center hero-card bg-light w-75'>
                    <Card.Img variant="top" src="../../hero.png" className='w-25 mb-4'/>
                    <h1 className='text-center mb-4'>Добро пожаловать<br/>в&nbsp;&laquo;Книжный Ассистент&raquo;</h1>
                    <p className='text-center mb-4'>
                        Здесь вы&nbsp;найдете мощный инструмент для организации и&nbsp;управления вашей библиотекой.
                        Наше приложение предоставляет вам простой и&nbsp;эффективный способ управлять каталогом книг,
                        информацией о&nbsp;читателях и&nbsp;многими другими аспектами вашей библиотеки.
                    </p>
                    <p className='text-center mb-5'>
                        Спасибо за&nbsp;выбор нашей системы. Мы&nbsp;надеемся, что она будет надежным и&nbsp;полезным
                        инструментом!
                    </p>
                    <div className='d-flex'>
                        {userInfo ? (
                            <>
                                {userInfo.isAdmin ? (
                                    <>
                                        <LinkContainer to="/books">
                                            <Button variant="primary" className="me-3">
                                                Каталог книг
                                            </Button>
                                        </LinkContainer>
                                        <LinkContainer to='/tickets'>
                                            <Button variant='primary' className='me-3'>
                                                Читательские билеты
                                            </Button>
                                        </LinkContainer>
                                        <LinkContainer to='/reports'>
                                            <Button variant='primary' className='me-3'>
                                                Отчёты
                                            </Button>
                                        </LinkContainer>
                                    </>
                                ) : (
                                    <LinkContainer to="/books">
                                        <Button variant="primary" className="me-3">
                                            Перейти в каталог книг
                                        </Button>
                                    </LinkContainer>
                                )}
                            </>
                        ) : (
                            <>
                                <LinkContainer to="/login">
                                    <Button variant="primary" className="me-3">
                                        Вход
                                    </Button>
                                </LinkContainer>
                                <LinkContainer to="/register">
                                    <Button variant="secondary">Регистрация</Button>
                                </LinkContainer>
                            </>
                        )}
                    </div>
                </Card>
            </Container>
        </div>
    );
};

export default Hero;
