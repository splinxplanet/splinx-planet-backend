const express = require('express');
const router = express.Router();
const {
  createPlan,
  editPlan,
  fetchAllPlans,
  deletePlan,
  toggleActiveStatus,
} = require('../controllers/subscriptionPlanController');
const authenticationToken = require("../utils/validation"); // Auth middleware

// Create new plan
router.post('/create', authenticationToken, createPlan);

// Edit a plan
router.put('/edit/:id', authenticationToken, editPlan);

// Fetch all plans
router.get('/plans', authenticationToken, fetchAllPlans);

// Delete a plan
router.delete('/delete/:id', authenticationToken, deletePlan);

// Toggle active status of a plan
router.patch('/toggle-status/:id', authenticationToken, toggleActiveStatus);

module.exports = router;
