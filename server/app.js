require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

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
) => ({}); // no context
//   type Context = Awaited<ReturnType<typeof createContext>>;
/** @typedef {Awaited<ReturnType<typeof createContext>>} Context */
const { appRouter } = require('./trpc/router.cjs');

app.use(
    '/trpc',
    trpcExpress.createExpressMiddleware({
        router: appRouter,
        createContext
    })
);

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
