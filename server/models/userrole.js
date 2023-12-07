'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class UserRole extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    UserRole.init(
        {
            role_id: DataTypes.NUMBER,
            user_id: DataTypes.NUMBER,
        },
        {
            sequelize,
            modelName: 'UserRole',
        },
    );
    return UserRole;
};
