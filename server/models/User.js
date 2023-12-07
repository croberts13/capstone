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
        }
    }
    User.init(
        {
            username: DataTypes.STRING,
            email: DataTypes.STRING,
            phone: DataTypes.JSON,
            address: DataTypes.JSON,
            role_id: DataTypes.INTEGER,
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                set: (password) =>
                    bcrypt.hashSync(password, Math.random(10_000_000_000)),
            },
        },
        {
            sequelize,
            modelName: 'User',
        },
    );

    User.prototype.validatePassword = function (password) {
        return bcrypt.compareSync(password, this.password);
    };

    return User;
};
