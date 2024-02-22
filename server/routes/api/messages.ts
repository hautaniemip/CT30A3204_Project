import express from 'express';
import jwt, {JwtPayload} from 'jsonwebtoken';
import passport from 'passport';

import {User} from '../../models/user';
import {Message} from '../../models/message';
import {Chat} from "../../models/chat";

export const router = express.Router();

router.get('/:chat', passport.authenticate('jwt'), (req, res) => {
    const token = req.cookies['access_token'];
    const decoded_token = jwt.verify(token, process.env.SECRET) as JwtPayload;
    const id = decoded_token._id;
    const chatId = req.params.chat;

    User.findById(id).then((user) => {
        if (!user) {
            res.status(400).send();
            return;
        }

        Chat.findById(chatId).then((chat) => {
            if (!chat) {
                res.status(400).send();
                return;
            }

            Message.find({chat: chatId}).then(messages => res.json(messages));
        }).catch(() => res.status(400).send());
    }).catch(() => res.status(400).send());
});

router.post('/:chat', passport.authenticate('jwt'), (req, res) => {
    const token = req.cookies['access_token'];
    const decoded_token = jwt.verify(token, process.env.SECRET) as JwtPayload;
    const id = decoded_token._id;
    const chatId = req.params.chat;
    const content = req.body.message;

    User.findById(id).then((user) => {
        if (!user) {
            res.status(400).send();
            return;
        }

        Message.create({chat: chatId, sender: user._id, content: content});
        Chat.findById(chatId).then((chat) => {
            if (chat)
                chat.save();
        });
        res.send();
    });
});