import express from 'express';
import jwt, {JwtPayload} from 'jsonwebtoken';
import passport from 'passport';

import {User} from '../../models/user';
import {Chat} from '../../models/chat';

export const router = express.Router();

router.get('/', passport.authenticate('jwt'), (req, res) => {
    const token = req.cookies['access_token']
    const decoded_token = jwt.verify(token, process.env.SECRET) as JwtPayload;
    const id = decoded_token._id;

    User.findById(id).then((user) => {
        if (!user) {
            res.status(400).send();
            return;
        }

        Chat.find({participants: user._id}).then((chats) => {
            console.log(chats);
            res.json({chats: chats});
        });
    });
});