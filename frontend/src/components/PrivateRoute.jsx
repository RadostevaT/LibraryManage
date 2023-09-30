import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ roles }) => {
    const { userInfo } = useSelector((state) => state.auth);

    // Проверяем, авторизован ли пользователь
    if (userInfo) {
        // Определяем роль пользователя на основе значения isAdmin
        const userRole = userInfo.isAdmin ? 'admin' : 'user';

        // Если не указаны роли для этого маршрута, разрешаем доступ всем авторизованным пользователям
        if (!roles || roles.includes(userRole)) {
            return <Outlet />;
        } else {
            // Перенаправляем пользователя на страницу "Доступ запрещен" или другую подходящую страницу
            return <Navigate to="/" replace />;
        }
    }

    // Перенаправляем неавторизованных пользователей на страницу входа
    return <Navigate to="/login" replace />;
};

export default PrivateRoute;
