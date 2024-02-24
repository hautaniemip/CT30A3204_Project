import express from 'express';
import passport from 'passport';

import {User} from '../../models/user';
import {Chat} from '../../models/chat';
import {Message} from '../../models/message';
import {getIdFromJwtCookie} from '../../helpers/helpers';

export const router = express.Router();

router.get('/', passport.authenticate('jwt'), (req, res) => {
    const id = getIdFromJwtCookie(req);

    User.findById(id).then((user) => {
        if (!user) {
            res.status(400).send();
            return;
        }

        Chat.find({participants: user._id}, {}, {sort: {updatedAt: -1}}).then((chats) => {
            console.log(chats);
            res.json({chats: chats});
        });
    });
});

router.get('/:chat', passport.authenticate('jwt'), (req, res) => {
    const id = getIdFromJwtCookie(req);
    const chatId = req.params.chat;

    User.findById(id).then((user) => {
        if (!user) {
            res.status(400).send();
            return;
        }

        Chat.findById(chatId).then(async (chat) => {
            if (!chat) {
                res.status(400).send();
                return;
            }

            let otherUserId = null;
            for (const participant of chat.participants) {
                if (participant.toString() === id)
                    continue;
                otherUserId = participant;
            }

            const otherUser = await User.findById(otherUserId);
            const lastMessage = await Message.findOne({chat: chatId}, {}, {sort: {createdAt: -1}});

            if (!otherUser) {
                res.status(400).send();
                return;
            }
            res.json({
                name: otherUser.name,
                time: lastMessage ? lastMessage.createdAt : null,
                sender: lastMessage && lastMessage.sender.toString() === id ? 'You' : otherUser.name.split(' ')[0],
                message: lastMessage ? lastMessage.content : null
            })
        });
    });
});