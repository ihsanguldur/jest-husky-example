const allModels = require('../models');
const Todo = allModels.Todo;

module.exports = {
    create: async function(content, state, userID) {
        try {
            await Todo.create({
                content,
                state,
                userID
            });

            return true;
        } catch (e) {
            throw new Error(e.message);
        }
    },

    findAll: async function(userID) {
        try {
            return await Todo.findAll({
                where: {
                    userID
                },
                raw: true
            });
        } catch (e) {
            throw new Error(e.message);
        }
    }
}