import http from 'http';
import express from 'express';
import session from 'express-session';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import mongoose from 'mongoose';
import passport from 'passport';
import {Strategy as JwtStrategy, ExtractJwt} from 'passport-jwt';

const debug = require('debug')('server:server');

require('dotenv').config();

import {router as apiRouter} from './routes/api';
import {User} from './models/user';

const app = express();

mongoose.connect(process.env.MONGODB_URI);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {sameSite: "lax", secure: false}
}));

app.use(passport.initialize());
app.use(passport.session());

const cookieExtractor = (req: any) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['access_token'];
    }
    return token;
}

passport.use(new JwtStrategy({
    jwtFromRequest: cookieExtractor,
    secretOrKey: process.env.SECRET || 'secret'
}, (jwtPayload, done) => {
    User.findOne({email: jwtPayload.email}).then((user) => {
        if (!user)
            return done(null, false);
        return done(null, user);
    });
}));

passport.serializeUser((user: any, done: any) => {
    done(null, user);
});

passport.deserializeUser((user: any, done: any) => {
    done(null, user);
});

app.use('/api', apiRouter);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve('..', 'client', 'build')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve('..', 'client', 'build', 'index.html'));
    });
} else if (process.env.NODE_ENV === 'development') {
    const corsOptions = {
        origin: 'http://localhost:3000',
        optionsSuccessStatus: 200,
    };
    app.use(cors(corsOptions))
}


const port: string | number = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function onError(error: any) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    const addr = server.address();
    // @ts-ignore
    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    debug('Listening on ' + bind);
}
