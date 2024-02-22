import express from 'express';
import {router as userRouter} from './api/users';
import {router as messageRouter} from './api/messages';
import {router as chatRouter} from './api/chats'

export const router = express.Router();

router.use('/users', userRouter);
router.use('/messages', messageRouter);
router.use('/chats', chatRouter)