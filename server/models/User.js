'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            User.belongsTo(models.Role, { foreignKey: 'role_id' });
            this.hasMany(models.Appointment, {
                foreignKey: 'doctor_id',
                as: 'doctor_appointments'
            });
            this.hasMany(models.Appointment, {
                foreignKey: 'patient_id',
                as: 'patient_appointments'
            });
        }

        static attachScope(
            /** @type {import('../models').DBInstance} */ models
        ) {
            // scope withRole
            this.addScope('withRole', {
                include: [
                    {
                        model: models.Role
                    }
                ]
            });

            this.addScope('doctor', {
                include: [
                    {
                        model: models.Role,
                        where: {
                            title: 'doctor'
                        },
                        required: true
                    }
                ]
            });

            this.addScope('patient', {
                incluce: [
                    {
                        model: models.Role,
                        where: {
                            title: 'patient'
                        },
                        required: true
                    }
                ]
            });
        }

        static hashSync(password) {
            this.password = bcrypt.hashSync(password, Math.random(10_000_000));
            return this.password;
        }

        validatePassword(password) {
            console.log({ raw: password, hash: this.password });
            return bcrypt.compareSync(password, this.password);
        }
    }

    User.init(
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            username: DataTypes.STRING,
            email: DataTypes.STRING,
            phone: DataTypes.JSON,
            address: DataTypes.JSON,
            role_id: DataTypes.INTEGER,
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                set: (password) =>
                    User.hashSync(password, Math.random(10_000_000_000))
                // hidden: true
            }
        },
        {
            sequelize,
            modelName: 'User',
            defaultScope: {
                // attributes: { exclude: ['password'] }
            }
        }
    );

    // User.prototype.validatePassword = function (password) {
    //     console.log({ raw: password, hash: this.password });
    //     return bcrypt.compareSync(password, this.password);
    // };

    return User;
};

/** @typedef {ReturnType<module['exports']>} User */
