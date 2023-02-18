'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Todo extends Model {
        static associate(models) {
            models.Todo.belongsTo(models.User, {as: 'UsersTodo', foreignKey: 'userID'});
        }
    }

    Todo.init({
        content: {
            type: DataTypes.STRING,
            allowNull: false
        },
        state: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        userID: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Todo',
    });
    return Todo;
};