const express = require('express');
const { registerUser, loginUser, resetPassword, confirmDeletion, deleteUserAccount, sendFeedback } = require('../controllers/auth/auth-controller');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/reset-password', resetPassword);
router.post('/confirm-delete', confirmDeletion); 
router.delete('/delete-account', deleteUserAccount);
router.post('/send-feedback', sendFeedback);

module.exports = router;
