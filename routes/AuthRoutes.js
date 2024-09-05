const express = require('express');
const router = express.Router();
const userController = require('../controller/AuthController');

// Route for creating a new user
router.post('/saveUser', userController.saveUser);

router.post('/confirmUser', userController.confirmUser);

router.get('/check-plan/:id', userController.checkUserPlan);


module.exports = router;
