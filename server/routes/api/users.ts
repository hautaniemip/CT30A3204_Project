import express from 'express';
import {body, validationResult} from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt, {JwtPayload} from 'jsonwebtoken';
import passport from 'passport';

import {User} from '../../models/user';
import {getIdFromJwtCookie, match} from '../../helpers/helpers';

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

        User.create({name: name, email: email, password: hash, status: ""});
        res.status(200).send();
    });
});

router.post('/login', async (req, res) => {
    const token = req.cookies['access_token'];

    // Login user with token and return user details
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

    // Nomarl login process
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

router.post('/logout', passport.authenticate('jwt'), (req, res) => {
    res.clearCookie("access_token").send();
});

router.get('/random', passport.authenticate('jwt'), (req, res) => {
    const id = getIdFromJwtCookie(req);

    User.findById(id).then(async (user) => {
        if (!user) {
            res.status(400).send();
            return;
        }
        const count = await User.countDocuments({});

        if (user.liked.length + user.disliked.length >= count - 1) {
            res.status(200).json({id: "0", name: ""});
            return;
        }

        let randomUser = null;
        do {
            const random = Math.floor(Math.random() * count);
            randomUser = await User.findOne().skip(random);

            if (!randomUser) {
                res.status(400).send();
                return;
            }
        } while (user._id.toString() === randomUser._id.toString() || user.liked.includes(randomUser._id) || user.disliked.includes(randomUser._id))

        res.json({id: randomUser._id, name: randomUser.name, status: randomUser.status})
    }).catch((err) => res.status(400).send(err));
});


router.get('/:user', passport.authenticate('jwt'), (req, res) => {
    const id = getIdFromJwtCookie(req);
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
                status: user.status,
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

            res.json({name: user.name, status: user.status});
        }).catch(() => res.status(400).send());
    }).catch(() => res.status(400).send());
});

router.put('/edit', passport.authenticate('jwt'), (req, res) => {
    const id = getIdFromJwtCookie(req);
    const name = req.body.name;
    const email = req.body.email;
    const status = req.body.status;

    User.findByIdAndUpdate(id, {name: name, email: email, status: status}).then((user) => {
        if (!user) {
            res.status(400).send();
            return;
        }

        res.send();
    }).catch(() => res.status(400).send());
});

router.post('/dislike', passport.authenticate('jwt'), async (req, res) => {
    const id = getIdFromJwtCookie(req);
    const disliked = req.body.id;

    User.findByIdAndUpdate(id, {'$addToSet': {'disliked': disliked}}).catch(() => res.status(400).send());
    res.send();
});

router.post('/like', passport.authenticate('jwt'), async (req, res) => {
    const id = getIdFromJwtCookie(req);
    const liked = req.body.id;

    const matchFound = await User.findByIdAndUpdate(id, {'$addToSet': {'liked': liked}}, {returnDocument: 'after'}).then(async (user) => {
        return await match(user, true)
    }).catch(() => res.status(400).send());
    User.findByIdAndUpdate(liked, {'$addToSet': {'likedBy': id}}, {returnDocument: 'after'}).then(async (user) => await match(user, false)).catch(() => res.status(400).send());
    res.json({matchFound});
});
