import { Router } from 'express';
import {loginUser, refreshToken, registerUser, logoutUser} from "../controller/user.controller.js"

const router = Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').post(logoutUser);
router.route('/token').post(refreshToken);

export default router