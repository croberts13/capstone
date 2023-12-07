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

        const doctors = await db.User.findAll({
            $where: {
                role_id: db.Role.findOne({ $where: { title: 'doctor' } }).id,
            },
        });
        const patients = await db.User.findAll({
            $where: {
                role_id: db.Role.findOne({ $where: { title: 'patient' } }).id,
            },
        });

        const appoitnments = patients.flatMap((patient) =>
            doctors.map((doctor) => ({
                patientId: patient.id,
                doctorId: doctor.id,
                createdAt: new Date(),
                updatedAt: new Date(),
                reason: 'seed reason',
            })),
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
    },
};
