const express = require('express');
const router = express.Router();
const withdrawalController = require('../controllers/withdrawalController');
const authMiddleware = require("../utils/validation");

// make a withdrawal request
router.post('/withdraw-request', authMiddleware, withdrawalController.submitWithdrawalRequest);

// approve a withdrawal request
router.put('/approval/:id', authMiddleware, withdrawalController.approveWithdrawal);

// deny a withdrawal request
router.put('/denied/:id', authMiddleware,withdrawalController.denyWithdrawal);

// delete a withdrawal request
router.delete('/delete/:id', authMiddleware, withdrawalController.deleteWithdrawalRequest);

// fetch all withdrawals
router.get('/withdrawals', authMiddleware, withdrawalController.fetchAllWithdrawals);

// fetch a single withdrawal request
router.get('/withdrawal-history/:userId', authMiddleware, withdrawalController.fetchUserWithdrawal);

module.exports = router;
