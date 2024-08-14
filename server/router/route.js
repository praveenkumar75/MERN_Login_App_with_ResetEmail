const Router = require('express');
const router = Router();
const controller = require('../controller/appController')
const registerMail = require('../controller/mailer')
const AuthVal = require('../middleware/auth');

router.route('/register').post(controller.register)
router.route('/registerMail').post(registerMail.registerMail);
router.route('/authenticate').post(controller.verifyUser, (req,res)=> res.end());
router.route('/login').post(controller.verifyUser, controller.login);

router.route('/user/:username').get(controller.getUser);
router.route('/generateOTP').get(controller.verifyUser, AuthVal.localVariable, controller.generateOTP);
router.route('/verifyOTP').get(controller.verifyUser, controller.verifyOTP);
router.route('/createResetSession').get(controller.createResetSession);

router.route('/updateUser').put(AuthVal.Auth, controller.updateUser);
router.route('/resetPassword').put(controller.verifyUser, controller.resetPassword);

module.exports = router;