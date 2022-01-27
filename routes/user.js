const express = require('express');
let router = express.Router();
const SanitizeMiddleware = require('../middlewares/sanitize');
const RegistrationMiddleware = require('../middlewares/registration');
const UserController = require('../controllers/users.controller');

router.post('/', (req, res, next) => {
    [
        SanitizeMiddleware.sanitizeClientContent(['username']),
        RegistrationMiddleware.signupRequestSchema,
        RegistrationMiddleware.isUniqueUser,
        UserController.insert,
    ]
    next();
});

module.exports = router;