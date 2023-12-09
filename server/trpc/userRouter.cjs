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
    })
});
exports.userRouter = userRouter;
