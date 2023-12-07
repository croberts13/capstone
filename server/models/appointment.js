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
        }
    }
    Appointment.init(
        {
            title: DataTypes.STRING,
            date: DataTypes.DATE,
            patientId: DataTypes.INTEGER,
            doctorId: DataTypes.INTEGER,
            reason: DataTypes.STRING,
            share: DataTypes.BOOLEAN,
        },
        {
            sequelize,
            modelName: 'Appointment',
        }
    );
    return Appointment;
};
