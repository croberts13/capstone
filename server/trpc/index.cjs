const { z } = require('zod');
const { t } = require('./router.cjs');
const { authRouter } = require('./authRouter.cjs');
const { appointmentRouter } = require('./appointmentRouter.cjs');
const { userRouter } = require('./userRouter.cjs');

const appRouter = t.router({
    appointments: appointmentRouter,
    auth: authRouter,
    user: userRouter
});

module.exports = {
    t,
    appRouter
};

// export type definition of API
// export type AppRouter = typeof appRouter;
/** @typedef {typeof appRouter} AppRouter */
