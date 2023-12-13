require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const indexRouter = require('./routes/index');

const app = express();

app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../client/dist')));

var sess = {
    genid: (req) => {
        return uuidv4(); // Use UUIDs for session IDs
    },
    secret: process.env.SESSION_SECRET ?? 'keyboard cat',
    cookie: {},
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, // Set to true if using HTTPS
        httpOnly: true, // Ensures cookies are only accessible via HTTP(S) requests, not client-side JavaScript
        maxAge: 3600000 // Session cookie expiration time in milliseconds (adjust as needed)
    }
};

if (app.get('env') === 'production') {
    app.set('trust proxy', 1); // trust first proxy
    sess.cookie.secure = true; // serve secure cookies
}

const session = require('express-session');
app.use(session(sess));

app.use('/', indexRouter);
app.use('/api/auth', require('./routes/auth'));
app.use('/users', require('./routes/users'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/patients', require('./routes/patients'));

// import { initTRPC } from '@trpc/server';
// import * as trpcExpress from '@trpc/server/adapters/express';

const { initTRPC } = require('@trpc/server');
const trpcExpress = require('@trpc/server/adapters/express');

// created for each request
const createContext = (
    /** @type {trpcExpress.CreateExpressContextOptions}*/ { req, res }
) => {
    const token = req.headers['authorization']?.split(' ')[1];

    const user = !token ? null : decodeToken(token)?.user;

    // console.log('createContext',{ token, user });

    // return {
    //     session: req.session,
    //     reqCookies: req.cookies,
    //     resCookies: res.cookies,
    //     user
    // };

    return user ? { user } : {};
}; // no context
//   type Context = Awaited<ReturnType<typeof createContext>>;
/** @typedef {Awaited<ReturnType<typeof createContext>>} Context */
const { appRouter } = require('./trpc/index.cjs');
const { decodeToken } = require('./trpc/authRouter.cjs');

app.use(
    '/trpc',
    trpcExpress.createExpressMiddleware({
        router: appRouter,
        createContext
    })
);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    console.error(err.stack);
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
