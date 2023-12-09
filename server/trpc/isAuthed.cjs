const { TRPCError } = require('@trpc/server');
const { t } = require('./router.cjs');

const isAuthed = t.middleware((opts) => {
    const { ctx } = opts;
    if (!ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    console.log({ authedUser: ctx.user });
    return opts.next({
        ctx: {
            user: ctx.user
        }
    });
});
exports.isAuthed = isAuthed;
