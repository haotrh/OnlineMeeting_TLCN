const express = require('express')
const validate = require('../middleware/validate')
const roomController = require('../controllers/room.controller')
const roomValidation = require('../validations/room.validation')
const auth = require('../middleware/auth')

const router = express.Router();

router.get('/:id', roomController.getRoom);
router.post('/', validate(roomValidation.create), auth(), roomController.create);
router.put('/:id', validate(roomValidation.update), auth(), roomController.update);
router.delete('/:id', auth(), roomController.deleteRoom);

module.exports = router;