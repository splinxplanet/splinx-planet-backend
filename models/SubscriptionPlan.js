const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  planName: { type: String, required: true },
  type: { type: String, required: true },
  interval: { type: String, required: true },
  period: { type: String, required: true },
  price: { type: String, required: true },
  amount: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  isRecurring: { type: Boolean, required: true },
  isActive: { type: Boolean, default: true } 
});

const SubscriptionPlan = mongoose.model('SubscriptionPlan', subscriptionSchema);

module.exports = SubscriptionPlan;
