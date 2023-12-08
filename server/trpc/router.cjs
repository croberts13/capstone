// import { initTRPC } from '@trpc/server';
// import { z } from 'zod';
const { initTRPC, TRPCError } = require('@trpc/server');
const { z } = require('zod');
const db = require('../models');

const t = initTRPC.create();
const router = t.router;

const authRouter = router({
    //login mutation that validates user and writes jwt to session
    login: t.procedure
        .input(z.object({ email: z.string(), password: z.string() }))
        .mutation(async (opts) => {
            const { input } = opts;
            const user = await db.User.findOne({
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

            return user;
        })
});

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
    })
});

const appRouter = t.router({
    getUser: t.procedure.input(z.string()).query((opts) => {
        opts.input; // string
        return { id: opts.input, name: 'Bilbo' };
    }),
    createUser: t.procedure
        .input(z.object({ name: z.string().min(5) }))
        .mutation(async (opts) => {
            // use your ORM of choice
            return await UserModel.create({
                data: opts.input
            });
        }),
    appointments: appointmentRouter,
    auth: authRouter
});

module.exports = {
    t,
    appRouter
};

// export type definition of API
// export type AppRouter = typeof appRouter;
/** @typedef {typeof appRouter} AppRouter */
