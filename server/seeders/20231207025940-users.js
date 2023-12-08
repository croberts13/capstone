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
            (res) => res.id,
        );
        
        const patientRoleId = await db.Role.findOne({ title: 'patient' }).then(
            (res) => res.id,
        );
        const doctors = Array(15)
            .fill(null)
            .map((_, index) => ({
                username: `doctor${index + 1}`,
                email: `doctor${index + 1}@pointsync.com`,
                password: db.User.hashSync('password'),
                createdAt: new Date(),
                updatedAt: new Date(),
                role_id: doctorRoleId,
            }));

        const patients = Array(100)
            .fill(null)
            .map((_, index) => ({
                username: `patient${index + 1}`,
                email: `patient${index + 1}@pointsync.com`,
                password: db.User.hashSync('password'),
                createdAt: new Date(),
                updatedAt: new Date(),
                role_id: patientRoleId,
            }));

        const users = [...doctors, ...patients];

        // console.log({ users });
        await queryInterface.bulkInsert('Users', /** @type User[] */ (users));
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete('User', null, {});
    },
};
