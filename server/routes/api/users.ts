import express from 'express';
import {body, validationResult} from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt, {JwtPayload} from 'jsonwebtoken';
import passport from 'passport';

import {User} from '../../models/user';
import {Chat} from "../../models/chat";

export const router = express.Router();


router.post('/register', body('name').isLength({min: 3}), body('email').isEmail(), body('password').isLength({min: 8}), (req, res) => {
    console.log(validationResult(req));
    const result = validationResult(req);
    if (!result.isEmpty()) {
        res.status(400).send(result);
        return;
    }

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    const hash = bcrypt.hashSync(password);

    User.findOne({email: email}).then((user) => {
        if (user) {
            res.status(403).send({email: 'Email already in use.'});
            return;
        }

        User.create({name: name, email: email, password: hash});
        res.status(200).send();
    });
});

router.post('/login', async (req, res) => {
    const token = req.cookies['access_token'];

    if (token) {
        const decoded_token = jwt.verify(token, process.env.SECRET) as JwtPayload;
        const id = decoded_token._id;
        const succes = await User.findById(id).then((user) => {
            if (user) {
                const token = jwt.sign({_id: user._id, email: user.email}, process.env.SECRET);
                res.cookie('access_token', token, {
                    maxAge: 3 * 3600e3,
                    httpOnly: true,
                    sameSite: 'lax',
                });

                res.json({id: user._id, name: user.name, email: user.email});
                return true;
            }

            return false;
        });

        if (succes)
            return;
    }

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email: email}).then((user) => {
        if (!user || !bcrypt.compareSync(password, user.password)) {
            res.status(401).send();
            return;
        }
        const token = jwt.sign({_id: user._id, email: email}, process.env.SECRET);
        res.cookie('access_token', token, {
            maxAge: 3 * 3600e3,
            httpOnly: true,
            sameSite: 'lax',
        });
        res.json({id: user._id, name: user.name, email: user.email});
    });
});

router.get('/:user', passport.authenticate('jwt'), (req, res) => {
    const token = req.cookies['access_token'];
    const decoded_token = jwt.verify(token, process.env.SECRET) as JwtPayload;
    const id = decoded_token._id;
    const userId = req.params.user;

    User.findById(id).then((user) => {
        if (!user) {
            res.status(400).send();
            return;
        }

        if (user._id.toString() === userId) {
            res.json({
                name: user.name,
                email: user.email,
                liked: user.liked,
                likedBy: user.likedBy,
                matches: user.matches
            });
            return;
        }

        User.findById(userId).then((user) => {
            if (!user) {
                res.status(400).send();
                return;
            }

            res.json({name: user.name});
        }).catch(() => res.status(400).send());
    }).catch(() => res.status(400).send());
});

router.put('/edit', passport.authenticate('jwt'), (req, res) => {
    const token = req.cookies['access_token'];
    const decoded_token = jwt.verify(token, process.env.SECRET) as JwtPayload;
    const id = decoded_token._id;
    const name = req.body.name;
    const email = req.body.email;

    User.findByIdAndUpdate(id, {name: name, email: email}).then((user) => {
        if (!user) {
            res.status(400).send();
            return;
        }

        res.send();
    }).catch(() => res.status(400).send());
});

router.post('/like', passport.authenticate('jwt'), async (req, res) => {
    const token = req.cookies['access_token'];
    const decoded_token = jwt.verify(token, process.env.SECRET) as JwtPayload;
    const id = decoded_token._id;
    const liked = req.body.id;

    User.findByIdAndUpdate(id, {'$addToSet': {'liked': liked}}, {returnDocument: 'after'}).then(await match).catch(() => res.status(400).send());
    User.findByIdAndUpdate(liked, {'$addToSet': {'likedBy': id}}, {returnDocument: 'after'}).then(await match).catch(() => res.status(400).send());
    res.send();
});

const match = async (user: any) => {
    if (!user)
        return;

    for (const likedId of user.liked) {
        for (const likedById of user.likedBy) {
            if (likedId.toString() === likedById.toString()) {
                if (!user.matches.includes(likedId)) {
                    user.matches.push(likedId);
                }
                Chat.find({participants: {'$all': [user._id, likedById]}}).then(async (chats) => {
                    if (chats.length === 0)
                        await Chat.create({participants: [user._id, likedById]});
                });
            }
        }
    }
    user.save();
}