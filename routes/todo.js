const router = require('express').Router();
const models = require('../models');
const validator = require("../middleware/validator");

const todoController = require('../controller/todoController');

router.post('/',validator([models.Todo], "body"), todoController.createTodo);

router.get('/', todoController.getTodos);

module.exports = router;