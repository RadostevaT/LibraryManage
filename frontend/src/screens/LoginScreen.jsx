import {useState, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {Form, Button, Row, Col} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import FormContainer from "../components/FormContainer";
import {useLoginMutation} from "../slices/usersApiSlice";
import {setCredentials} from "../slices/authSlice";
import {toast} from "react-toastify";
import Loader from "../components/Loader";

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [login, {isLoading}] = useLoginMutation();

    const {userInfo} = useSelector((state) => state.auth);

    useEffect(() => {
        if (userInfo) {
            navigate('/');
        }
    }, [navigate, userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await login({email, password}).unwrap();
            dispatch(setCredentials({...res}));
            navigate('/');
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    }

    return (
        <FormContainer>
            <h1>Вход</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group className='my-2' controlId='email'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type='email'
                        placeholder='Введите email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group className='my-2' controlId='password'>
                    <Form.Label>Пароль</Form.Label>
                    <Form.Control
                        type='password'
                        placeholder='Введите пароль'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                {isLoading && <Loader/>}

                <Button type='submit' variant='primary' className='mt-3'>
                    Войти
                </Button>

                <Row className='py-3'>
                    <Col>
                        Новый пользователь? <Link to='/register'>Регистрация</Link>
                    </Col>
                </Row>
            </Form>
        </FormContainer>
    )
}

export default LoginScreen
