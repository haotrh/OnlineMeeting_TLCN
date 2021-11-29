const express = require('express')
const validate = require('../middleware/validate')
const userController = require('../controllers/user.controller')
const userValidation = require('../validations/user.validation')
const auth = require('../middleware/auth')

const router = express.Router();

router.get('/:userId/rooms', validate(userValidation.getUserRooms), auth(), userController.getUserRooms);
router.get('/', validate(userValidation.searchUsers), auth(), userController.getUsers);
router.put('/:userId', auth(), userController.updateUser);
router.post('/:userId/change-password', validate(userValidation.changePassword), auth(), userController.changePassword);
router.delete('/:userId', auth(), userController.deleteUser);

module.exports = router;