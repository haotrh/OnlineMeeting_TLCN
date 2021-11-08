const express = require('express')
const validate = require('../middleware/validate')
const roomController = require('../controllers/room.controller')
const roomValidation = require('../validations/room.validation')
const auth = require('../middleware/auth')

const router = express.Router();

router.get('/:id', roomController.getRoom);
router.post('/', auth(), validate(roomValidation.create), roomController.create);
router.delete('/:id', auth(), roomController.deleteRoom);

module.exports = router;