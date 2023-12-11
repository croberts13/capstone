const { isAuthed } = require('./isAuthed.cjs');
const { t } = require('./router.cjs');
const db = require('../models');

const userRouter = t.router({
    getAppointments: t.procedure.use(isAuthed).query(async (otps) => {
        return await db.Appointment.findAll({
            include: [
                {
                    model: db.User,
                    as: otps.ctx.user.Role.title,
                    where: { id: otps.ctx.user.id }
                }
            ]
        });
    }),
    getDoctors: t.procedure.use(isAuthed).query(async (otps) => {
        //return users with doctor scope
        return await db.User.scope('doctor').findAll();
    }),
    getPatients: t.procedure.use(isAuthed).query(async (otps) => {
        // return users with patient scope
        return await db.User.scope('patient').findAll();
    }),
    getAll: t.procedure.use(isAuthed).query(async (otps) => {
        return await db.User.scope('withRole').findAll();
    })
});
exports.userRouter = userRouter;
