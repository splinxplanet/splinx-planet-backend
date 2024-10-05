const SubscriptionPlan = require('../models/SubscriptionPlan');

// Create a new plan
const createPlan = async (req, res) => {
  try {
    const newPlan = new SubscriptionPlan(req.body);
    await newPlan.save();
    res.status(201).json(newPlan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Edit a plan
const editPlan = async (req, res) => {
  try {
    const updatedPlan = await SubscriptionPlan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedPlan) return res.status(404).json({ message: 'Plan not found' });
    res.json(updatedPlan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Fetch all plans
const fetchAllPlans = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find();
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a plan
const deletePlan = async (req, res) => {
  try {
    const deletedPlan = await SubscriptionPlan.findByIdAndDelete(req.params.id);
    if (!deletedPlan) return res.status(404).json({ message: 'Plan not found' });
    res.json({ message: 'Plan deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle plan active status
const toggleActiveStatus = async (req, res) => {
  try {
    const plan = await SubscriptionPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    plan.isActive = !plan.isActive;
    await plan.save();
    res.json(plan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createPlan,
  editPlan,
  fetchAllPlans,
  deletePlan,
  toggleActiveStatus,
};
