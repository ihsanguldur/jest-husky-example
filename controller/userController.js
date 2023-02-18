const userService = require('../service/userService');

const generateToken = require('../helper/generateToken');

module.exports = {
    register: async function(req, res, next) {
        try {
            await userService.create(req.body.email, req.body.password);

            res.status(200).json({status: 'registered'});
        } catch (e) {
            console.log(e);
            res.status(500).json({err: e});
        }
    },

    login: async function(req, res, next) {
        try {
            let user = await userService.findOne(req.body.email, req.body.password);

            if(user == null) {
                return res.status(400).json({err: "user not found"});
            }

            let jwt = generateToken({sub: user.id});

            res.status(200).json({token: jwt});
        } catch (e) {
            console.log(e);
            res.status(500).json({err: e});
        }
    }
}
