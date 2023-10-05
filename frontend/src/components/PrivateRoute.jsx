import React from 'react';
import {Navigate, Outlet} from 'react-router-dom';
import {useSelector} from 'react-redux';

const PrivateRoute = ({roles}) => {
    const {userInfo} = useSelector((state) => state.auth);

    if (userInfo) {
        const userRole = userInfo.isAdmin ? 'admin' : 'user';

        if (!roles || roles.includes(userRole)) {
            // Разрешаем доступ, если нет указанных ролей или роль пользователя соответствует
            return <Outlet/>;
        } else {
            return <Navigate to="/" replace/>;
        }
    }

    // Перенаправляем неавторизованных пользователей на страницу входа
    return <Navigate to="/login" replace/>;
};

export default PrivateRoute;
