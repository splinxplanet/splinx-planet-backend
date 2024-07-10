const express = require("express");
const router = express.Router();
const flutterwaveController = require("../controllers/flutterwaveController");

// Fetch all plans
router.get("/fetch-all-plans", flutterwaveController.fetchAllPlans);

// Subscribe User to a Plan
router.post("/subscribe", flutterwaveController.subscribe);


// Cancel Subscription
router.post("/cancel-subscription", flutterwaveController.cancelSubscription);

// Get User Subscription Details
router.get("/subscription-details/:email", flutterwaveController.getSubscriptionDetails);

module.exports = router;