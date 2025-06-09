const express = require('express');
const router = express.Router();
const withdrawalController = require('../controllers/withdrawalController');
const authMiddleware = require("../utils/validation");

// make a withdrawal request
router.post('/withdraw-request', authMiddleware, withdrawalController.submitWithdrawalRequest);

// approve a withdrawal request
router.put('/approval/:id', withdrawalController.approveWithdrawal);

// deny a withdrawal request
router.delete('/denied/:id', withdrawalController.denyWithdrawal);

// fetch all withdrawals
router.get('/withdrawals', withdrawalController.fetchAllWithdrawals);

// fetch a single withdrawal request
router.get('/withdrawal-history/:userId', authMiddleware, withdrawalController.fetchUserWithdrawal);

module.exports = router;
