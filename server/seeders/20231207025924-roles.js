'use strict';

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
        const createdAt = new Date();
        await queryInterface.bulkInsert(
            'Roles',
            /** @type Role[] */ ([
                { title: 'doctor', createdAt, updatedAt: createdAt },
                { title: 'patient', createdAt, updatedAt: createdAt },
                { title: 'admin', createdAt, updatedAt: createdAt },
                { title: 'superadmin', createdAt, updatedAt: createdAt },
            ]),
        );
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete('Roles', null, {});
    },
};
