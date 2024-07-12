const express = require("express");
const router = express.Router();
const flutterwaveController = require("../controllers/flutterwaveController");

// Create Subscription Plan
router.post("/create-plan", flutterwaveController.createPlan);

// Fetch all plans
router.get("/fetch-all-plans", flutterwaveController.fetchAllPlans);

// Subscribe User to a Plan
router.post("/subscribe", flutterwaveController.subscribe);


// Cancel Subscription
router.post("/cancel-subscription", flutterwaveController.cancelSubscription);

// Get User Subscription Details
router.get("/subscription-details/:email", flutterwaveController.getSubscriptionDetails);

// Create payment route
router.post("/create-payment", flutterwaveController.createPayment);

module.exports = router;