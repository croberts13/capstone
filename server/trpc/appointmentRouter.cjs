const { z } = require('zod');
const db = require('../models');
const { router, t } = require('./router.cjs');
const { isAuthed } = require('./isAuthed.cjs');
const { Sequelize, Op } = require('sequelize');

const zNewAppointment = {
    title: z.string(),
    reason: z.string(),
    date: z.string(),
    doctor_id: z.number(),
    patient_id: z.number(),
    share: z.boolean().optional().default(false),
    hour_slot: z.number().or(z.number())
};

const appointmentRouter = router({
    createAppointment: t.procedure
        .input(z.object(zNewAppointment))
        .mutation(async (opts) => {
            const { input } = opts;
            return await db.Appointment.create(input);
        }),

    updateAppointment: t.procedure
        .input(z.object({ ...zNewAppointment, id: z.number().or(z.string()) }))
        .mutation(async (opts) => {
            // update the appoitnment that matches the id
            return await db.Appointment.update(opts.input, {
                where: { id: opts.input.id }
            });
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
        .input(z.array(z.string()))
        .query(async ({ ctx, input }) => {
            // get scheduled appointments for given dates
            const filledSlots = await db.Appointment.findAll({
                where: {
                    date: {
                        [Op.in]: input
                    },
                    [ctx.user.Role.title + '_id']: ctx.user.id
                },
                include: ['doctor', 'patient']
            });
            const defaultSlots = Array(8)
                .fill(null)
                .map((_, index) => 9 + index); //8hrs to 17hrs

            const openHourSlots = input.map((day) => {
                const _openHourSlots = defaultSlots.map(
                    (openHourSlot) =>
                        /**@type {db['Appointment']} */
                        (
                            filledSlots.find(
                                (fSlot) =>
                                    fSlot.date == day &&
                                    fSlot.hour_slot == openHourSlot
                            ) ?? { date: day, hour_slot: openHourSlot }
                        )
                );

                // return _openHourSlots.map((openHourSlot) => ({
                //     ...openHourSlot,
                //     date: day
                // }));
                return _openHourSlots;
            });

            return openHourSlots.flatMap((slotGroupts) => slotGroupts);
        }),
    deleteAppointment: t.procedure
        .use(isAuthed)
        .input(z.number())
        .mutation(async ({ input, ctx }) => {
            // delete appointments with the id=input and ctx.user.Role.title+'_id == ctx.user.id
            return await db.Appointment.destroy({
                where: {
                    [ctx.user.Role.title + '_id']: ctx.user.id,
                    id: input
                }
            });
        })
});
exports.appointmentRouter = appointmentRouter;
