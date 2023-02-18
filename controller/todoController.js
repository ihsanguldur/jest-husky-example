const todoService = require('../service/todoService');

module.exports = {
    createTodo: async function(req, res, next) {
        try {
            await todoService.create(req.body.content, req.body.state, req.TOKEN.sub);

            res.status(200).json({status: 'created'});
        } catch (e) {
            console.log(e);
            res.status(500).json({err: e});
        }
    },

    getTodos: async function(req, res, next) {
        try {
            let todos = await todoService.findAll(req.TOKEN.sub);

            res.status(200).json({data: todos});
        } catch (e) {
            console.log(e);
            res.status(500).json({err: e});
        }
    },
}