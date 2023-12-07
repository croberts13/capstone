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

        const doctors = Array(5)
            .fill(null)
            .map((_, index) => ({
                username: `doctor${index + 1}`,
                email: `doctor${index + 1}@pointsync.com`,
                password: 'password',
                createdAt: new Date(),
                updatedAt: new Date(),
                // roleId: db.Role.findOne({ title: 'doctor' }).id,
                role_id: 1,
            }));

        const patients = Array(5)
            .fill(null)
            .map((_, index) => ({
                username: `patient${index + 1}`,
                email: `patient${index + 1}@pointsync.com`,
                password: 'password',
                createdAt: new Date(),
                updatedAt: new Date(),
                // roleId: db.Role.findOne({ title: 'patient' }).id,
                role_id: 2,
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
