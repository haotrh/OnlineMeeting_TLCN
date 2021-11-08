const express = require('express')
const validate = require('../middleware/validate')
const userController = require('../controllers/user.controller')
const userValidation = require('../validations/user.validation')
const auth = require('../middleware/auth')

const router = express.Router();

router.get('/:userId/rooms', auth(), validate(userValidation.getUserCreatedRooms), userController.getUserCreatedRooms);

module.exports = router;