import {useState, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {Form, Button, Row, Col} from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import {toast} from 'react-toastify';
import Loader from '../components/Loader';
import {useRegisterMutation} from '../slices/usersApiSlice';
import {setCredentials} from '../slices/authSlice';

const RegisterScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmedPassword] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [register, {isLoading}] = useRegisterMutation();

    const {userInfo} = useSelector((state) => state.auth);

    useEffect(() => {
        if (userInfo) {
            navigate('/');
        }
    }, [navigate, userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Пароли не совпадают');
        } else {
            try {
                const res = await register({name, email, password}).unwrap();
                dispatch(setCredentials({...res}));
                navigate('/');
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    return (
        <FormContainer>
            <h1>Регистрация</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group className='my-2' controlId='name'>
                    <Form.Label>ФИО</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Введите ФИО'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className='my-2' controlId='email'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type='email'
                        placeholder='Введите email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className='my-2' controlId='password'>
                    <Form.Label>Пароль</Form.Label>
                    <Form.Control
                        type='password'
                        placeholder='Введите пароль'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className='my-2' controlId='confirmPassword'>
                    <Form.Label>Подтвердите пароль</Form.Label>
                    <Form.Control
                        type='password'
                        placeholder='Введите пароль'
                        value={confirmPassword}
                        onChange={(e) => setConfirmedPassword(e.target.value)}
                    />
                </Form.Group>

                {isLoading && <Loader/>}

                <Button type='submit' variant='primary' className='mt-3' disabled={isLoading}>
                    Зарегистрироваться
                </Button>

                <Row className='py-3'>
                    <Col>
                        Уже зарегистрированы? <Link to='/login'>Войти</Link>
                    </Col>
                </Row>
            </Form>
        </FormContainer>
    );
};

export default RegisterScreen;
