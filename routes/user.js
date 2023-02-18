const router = require('express').Router();
const models = require('../models');
const validator = require("../middleware/validator");

const userController = require('../controller/userController');

router.post('/register', validator([models.User], "body"), userController.register);
router.post('/login', validator([models.User], "body"), userController.login);

module.exports = router;