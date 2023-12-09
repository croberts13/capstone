const { z } = require('zod');
const db = require('../models');
const { router, t } = require('./router.cjs');
const { isAuthed } = require('./isAuthed.cjs');
const { Sequelize, Op } = require('sequelize');

const appointmentRouter = router({
    createAppointment: t.procedure
        .input(
            z.object({
                title: z.string(),
                reason: z.string(),
                date: z.date(),
                doctor_id: z.number(),
                patient_id: z.number(),
                share: z.boolean().optional().default(false)
            })
        )
        .mutation((opts) => {
            const { input } = opts;
            db.Appointment.create(input);
        }),
    getAppointments: t.procedure
        .input(z.number().optional())
        .query(async (opts) => {
            const { input } = opts;
            // make a query to get all appointments or one appointment using the id
            const query = input ? { where: { id: input } } : {};

            //
            return db.Appointment.findAll(query);
        }),
    // make a delete appointment mutation
    deleteAppointments: t.procedure.input(z.number()).mutation(async (opts) => {
        const appointment = await db.Appointment.findByPk(opts);
        await appointment.destroy();
        return appointment;
    }),
    getOpenHourSlots: t.procedure
        .use(isAuthed)
        .input(z.array(z.date()))
        .query(async ({ ctx, input }) => {
            // get scheduled appointments for given dates
            const filledSlots = await db.Appointment.findAll({
                where: {
                    date: {
                        [Op.in]: input
                    }
                }
            });
            const defaultSlots = Array(8)
                .fill(null)
                .map((_, index) => 8 + index); //8hrs to 17hrs

            const openHourSlots = input.map((day) => {
                const _openHourSlots = defaultSlots.filter(
                    (openHourSlot) =>
                        !filledSlots.some(
                            (fSlot) =>
                                fSlot.date == day &&
                                fSlot.hour_slot == openHourSlot
                        )
                );
                return _openHourSlots.map((openHourSlot) => ({
                    openHourSlot,
                    day
                }));
            });

            return openHourSlots;
        })
});
exports.appointmentRouter = appointmentRouter;
