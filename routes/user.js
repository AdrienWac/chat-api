const express = require('express');
let router = express.Router();
const SanitizeMiddleware = require('../middlewares/sanitize');
const RegistrationMiddleware = require('../middlewares/registration');
const UserController = require('../controllers/users.controller');

router.post(
    '/',
    [
        SanitizeMiddleware.sanitizeClientContent(['username']),
        RegistrationMiddleware.signupRequestSchema,
        UserController.add,
    ]
);


module.exports = router;