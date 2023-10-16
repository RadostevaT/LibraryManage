import express from "express";
import {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getAllReaders,
    createReaderTicket,
    deleteReaderTicket,
    extendReaderTicket
} from "../controllers/userController.js";

const router = express.Router();
import {protect} from "../middleware/authMiddleware.js";

router.post('/', registerUser);
router.post('/auth', authUser);
router.post('/logout', logoutUser);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/all-readers').get(protect, getAllReaders);

router.route('/create-reader-ticket').post(protect, createReaderTicket);
router.route('/delete-reader-ticket').delete(protect, deleteReaderTicket);
router.route('/extend-reader-ticket').post(protect, extendReaderTicket);

export default router;
