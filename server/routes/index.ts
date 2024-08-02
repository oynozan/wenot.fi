import { type Request, Router } from 'express';
import { type IUser } from '../db/User';

/* ROUTES */
import auth from './auth';
import payment from './payment';
import settings from './settings';

const router = Router();
router.use('/auth', auth);
router.use('/payment', payment);
router.use('/settings', settings);

export type UserRequest = Request & { user?: IUser };
export default router;