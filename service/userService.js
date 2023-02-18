const allModels = require('../models');
const User = allModels.User;

module.exports = {
    create: async function(email, password) {
        try {
            await User.create({
                email,
                password
            });

            return true;
        } catch (e) {
            throw new Error(e.message);
        }
    },

    findOne: async function (email, password) {
        try {
            return await User.findOne({
                where: {
                    email,
                    password
                }
            });
        } catch (e) {
            throw new Error(e.message);
        }

    }
}