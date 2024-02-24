import express from 'express';
import passport from 'passport';

import {User} from '../../models/user';
import {Message} from '../../models/message';
import {Chat} from "../../models/chat";
import {getIdFromJwtCookie} from '../../helpers/helpers';

export const router = express.Router();

router.get('/:chat', passport.authenticate('jwt'), (req, res) => {
    const id = getIdFromJwtCookie(req);
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

            Message.find({chat: chatId}, {}, {sort: {createdAt: -1}}).then((messages) => {
                let modifiedMessages = messages.map((message) => {
                    return {
                        id: message._id,
                        content: message.content,
                        sentByYou: message.sender.toString() === id,
                    }
                });
                res.json(modifiedMessages);
            });
        }).catch(() => res.status(400).send());
    }).catch(() => res.status(400).send());
});

router.post('/:chat', passport.authenticate('jwt'), (req, res) => {
    const id = getIdFromJwtCookie(req);
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