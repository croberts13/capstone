'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Appointments', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            title: {
                type: Sequelize.STRING
            },
            date: {
                type: Sequelize.DATEONLY
            },
            hour_slot: {
                type: Sequelize.INTEGER,
                // validate that value is betwee 8 and 17
                validate: {
                    min: 8,
                    max: 17
                }
            },
            patient_id: Sequelize.INTEGER,
            doctor_id: Sequelize.INTEGER,
            reason: {
                type: Sequelize.STRING
            },
            share: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Appointments');
    }
};
