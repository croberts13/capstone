'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Appointment extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.User, {
                as: 'doctor',
                foreignKey: 'doctor_id'
            });

            this.belongsTo(models.User, {
                as: 'patient',
                foreignKey: 'patient_id'
            });
        }
    }
    Appointment.init(
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            title: DataTypes.STRING,
            date: DataTypes.DATE,
            patient_id: DataTypes.INTEGER,
            doctor_id: DataTypes.INTEGER,
            reason: DataTypes.STRING,
            share: DataTypes.BOOLEAN
        },
        {
            sequelize,
            modelName: 'Appointment'
        }
    );
    return Appointment;
};

/** @typedef {ReturnType<module['exports']>} Appointment */
