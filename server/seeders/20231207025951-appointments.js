const db = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
         */

        const doctorRoleId = await db.Role.findOne({ title: 'doctor' }).then(
            (res) => res.id
        );

        const patientRoleId = await db.Role.findOne({ title: 'patient' }).then(
            (res) => res.id
        );

        const doctors = await db.User.findAll({
            where: {
                role_id: doctorRoleId
            },
            limit: 5,
            order: [['id', 'ASC']]
        });
        const patients = await db.User.findAll({
            where: {
                role_id: patientRoleId
            }
        });

        const appoitnments = patients
            .flatMap((patient) =>
                doctors.map((doctor) => ({
                    patient_id: patient.id,
                    title:
                        'test appointment' +
                        `${patient.email} - ${doctor.email}`,
                    doctor_id: doctor.id,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    reason: 'seed reason',
                    date: new Date()
                }))
            )
            .flatMap((apt) =>
                [8, 12, 17].map((hour_slot) => ({ ...apt, hour_slot }))
            );

        await queryInterface.bulkInsert('Appointments', appoitnments);
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */

        await queryInterface.bulkDelete('Appointments', null, {});
    }
};
