import {useState, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Form, Button} from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import {toast} from "react-toastify";
import Loader from "../components/Loader";
import {setCredentials} from "../slices/authSlice";
import {useUpdateUserMutation} from "../slices/usersApiSlice";

const ProfileScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmedPassword] = useState('');

    const dispatch = useDispatch();

    const {userInfo} = useSelector((state) => state.auth);

    const [updateProfile, {isLoading}] = useUpdateUserMutation();

    useEffect(() => {
        setName(userInfo.name);
        setEmail(userInfo.email);
    }, [userInfo.setName, userInfo.setEmail]);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Пароли не совпадают')
        } else {
            try {
                const res = await updateProfile({
                    _id: userInfo._id,
                    name,
                    email,
                    password,
                }).unwrap();
                dispatch(setCredentials(res));
                toast.success('Данные сохранены');
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    }

    return (
        <FormContainer>
            <h1 className='mb-4'>Профиль</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group className='my-2' controlId='name'>
                    <Form.Label>ФИО</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Введите ФИО'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        readOnly
                        disabled
                    ></Form.Control>
                </Form.Group>

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

                <Form.Group className='my-2' controlId='confirmPassword'>
                    <Form.Label>Подтвердите пароль</Form.Label>
                    <Form.Control
                        type='password'
                        placeholder='Введите пароль'
                        value={confirmPassword}
                        onChange={(e) => setConfirmedPassword(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                {isLoading && <Loader/>}

                <Button type='submit' variant='primary' className='mt-3'>
                    Сохранить
                </Button>
            </Form>
        </FormContainer>
    )
}

export default ProfileScreen;
