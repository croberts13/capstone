const { TRPCError } = require('@trpc/server');
const { z } = require('zod');
const db = require('../models');
const { router, t } = require('./router.cjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET ?? 'JWT_SECRET_KEY';

const decodeToken = (token) => jwt.verify(token, JWT_SECRET);

function generateAuthToken(/** @type {db['user']}*/ user) {
    const token = jwt.sign({ user }, JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ user }, JWT_SECRET, { expiresIn: '7d' });
    return { token, refreshToken };
}

const authRouter = router({
    //login mutation that validates user and writes jwt to session
    login: t.procedure
        .input(z.object({ email: z.string(), password: z.string() }))
        .mutation(async (opts) => {
            const { input, ctx } = opts;
            const user = await db.User.scope('withRole').findOne({
                where: { email: input.email }
            });

            if (!user) {
                // return a 404 response
                throw new TRPCError({ code: 'NOT_FOUND' });
            }

            if (!user.validatePassword(input.password)) {
                throw new TRPCError({
                    code: 'UNPROCESSABLE_CONTENT',
                    message: 'Invalid password'
                });
            }

            const { token, refreshToken } = generateAuthToken(user);

            // Store tokens in the session
            // ctx.session.token = token;
            // ctx.session.refreshToken = refreshToken;

            // ctx.cookie.set()
            // Set tokens as cookie values
            // console.log('login', ctx, ctx.resCookies);
            // ctx.resCookies('token', token, {
            //     httpOnly: true,
            //     maxAge: 3600000
            // });
            // ctx.resCookies('refreshToken', refreshToken, {
            //     httpOnly: true,
            //     maxAge: 7 * 24 * 60 * 60 * 1000
            // });

            // console.log(ctx);

            return { token, refreshToken, user };
        }),
    me: t.procedure.query(async ({ ctx }) => {
        if (!ctx.user) {
            throw new TRPCError({ code: 'FORBIDDEN' });
        }

        return ctx.user;
        console.log(ctx.session);
        if (!ctx?.session?.token) {
            // token expired error
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: { msg: 'Invalid token', context: ctx.session }
            });
        }

        //if refresh token

        //get the user from the token
        const { id } = jwt.decode(ctx.session.token);

        return await db.User.scope('withRole').findByPk(id, {
            // include: [{ model: db.Role }]
        });
    })
});
// exports.authRouter = authRouter;

module.exports = {
    decodeToken,
    authRouter
};
