import React from 'react'
import ReactDOM from 'react-dom/client'
import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider,
    Navigate
} from "react-router-dom";
import store from "./store.js";
import {Provider} from "react-redux";
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import PrivateRoute from "./components/PrivateRoute";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ProfileScreen from "./screens/ProfileScreen";
import BooksScreen from "./screens/BooksScreen";
import AdminBooksScreen from "./screens/AdminBooksScreen";
import TicketsScreen from "./screens/TicketsScreen";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/' element={<App/>}>
            <Route index={true} path='/' element={<HomeScreen/>}/>
            <Route path='/login' element={<LoginScreen/>}/>
            <Route path='/register' element={<RegisterScreen/>}/>

            {/* Private Routes for Authorized Users */}
            <Route path='' element={<PrivateRoute roles={['admin', 'user']}/>}>
                <Route path='/profile' element={<ProfileScreen/>}/>
            </Route>

            {/* Private Routes for Users */}
            <Route path='' element={<PrivateRoute roles={['user']}/>}>
                <Route path='/books' element={<BooksScreen/>}/>
            </Route>

            {/* Additional Route for Admins */}
            <Route path='' element={<PrivateRoute roles={['admin']}/>}>
                <Route path='/admin-books' element={<AdminBooksScreen/>}/>
            </Route>
            <Route path='' element={<PrivateRoute roles={['admin']}/>}>
                <Route path='/tickets' element={<TicketsScreen/>}/>
            </Route>

            {/* Redirect to Home Screen for Non-existent Routes */}
            <Route path='*' element={<Navigate to='/' />} />
        </Route>
    )
)


ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <React.StrictMode>
            <RouterProvider router={router}/>
        </React.StrictMode>
    </Provider>
);
