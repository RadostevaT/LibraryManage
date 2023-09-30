import express from "express";
import {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getAllReaders
} from "../controllers/userController.js";

const router = express.Router();
import {protect} from "../middleware/authMiddleware.js";

router.post('/', registerUser);
router.post('/auth', authUser);
router.post('/logout', logoutUser);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/all-readers').get(protect, getAllReaders);

export default router;
