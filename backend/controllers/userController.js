import asyncHandler from 'express-async-handler';
import generateToken from "../utils/generateToken.js";
import User from "../models/userModel.js";

// @desc    Auth user/set token
// route    POST /api/users/token
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({email});

    if (user && (await user.matchPassword(password))) {
        generateToken(res, user._id);
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        })
    } else {
        res.status(401);
        throw new Error('Неправильный логин или пароль');
    }
});

// @desc    Register a new user
// route    POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const {name, email, password} = req.body;

    const userExists = await User.findOne({email})

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({
        name,
        email,
        password,
        isAdmin: false, // Устанавливаем значение isAdmin как false при регистрации
    });

    if (user) {
        generateToken(res, user._id);
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        })
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Logout user
// route    POST /api/users/logout
// @access  Public
const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    })

    res.status(200).json({message: 'User logged out'})
});

// @desc    Get user profile
// route    GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email
    }

    res.status(200).json(user)
});

// @desc    Update user profile
// route    PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email
        })
    } else {
        res.status(404);
        throw new Error('User not found')
    }
});

// @desc    Get all readers with the option to search by name
// route    GET /api/users/all-readers
// @access  Private (only for admin users)
const getAllReaders = asyncHandler(async (req, res) => {
    let { query } = req.query;

    const filters = {
        isAdmin: false,
    };

    if (query) {
        query = decodeURIComponent(query);
        filters.name = { $regex: query, $options: 'i' };
    }

    const readers = await User.find(filters).populate('readerTicket');

    res.status(200).json(readers);
});

export {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getAllReaders
}
