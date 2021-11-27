const express = require('express')
const validate = require('../middleware/validate')
const authController = require('../controllers/auth.controller')
const authValidation = require('../validations/auth.validation')
const auth = require('../middleware/auth')

const router = express.Router();

router.post('/register', validate(authValidation.register), authController.register);
router.post('/login', validate(authValidation.login), authController.login);
router.post('/refresh-token', validate(authValidation.refreshToken), authController.refreshToken);
router.post('/forgot-password', validate(authValidation.forgotPassword), authController.forgotPassword);
router.post('/reset-password', validate(authValidation.resetPassword), authController.resetPassword);
router.post('/send-verification-email', auth(), authController.sendVerificationEmail);
router.post('/verify-email', validate(authValidation.verifyEmail), authController.verifyEmail);
router.post('/login-google', validate(authValidation.loginWithGoogle), authController.loginWithGoogle)
router.post('/login-facebook', validate(authValidation.loginWithFacebook), authController.loginWithFacebook)
router.post('/me', auth(), authController.me);

module.exports = router;
