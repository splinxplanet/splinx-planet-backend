const express = require('express');
const router = express.Router();
const withdrawalController = require('../controllers/withdrawalController');

router.post('/withdraw-request', withdrawalController.submitWithdrawalRequest);
router.put('/withdrawal/approve/:id', withdrawalController.approveWithdrawal);
router.delete('/withdrawal/deny/:id', withdrawalController.denyWithdrawal);
router.get('/withdrawals', withdrawalController.fetchAllWithdrawals);

module.exports = router;
