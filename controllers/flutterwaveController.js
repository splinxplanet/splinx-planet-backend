const Flutterwave = require('flutterwave-node-v3');
const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);


// create subscription plans
exports.createPlan = async (req, res) => { 
  console.log("Create new plans")

  try {
    const { name, amount, interval, currency } = req.body;

    const payload = {
      name,
      amount,
      interval,
      currency
    };
    const response = await flw.PaymentPlan.create(payload);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// fetch all plans
exports.fetchAllPlans = async (req, res) => {
  try {
    const response = await flw.PaymentPlan.get_all();
      console.log(response);
      // send response
      res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

// Subscribe User to a Plan
exports.subscribe =  async (req, res) => {
  try {
    const { plan_id, email } = req.body;
    const payload = {
      id: plan_id,
    };
    const response = await flw.Subscription.activate(payload);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cancel Subscription
exports.cancelSubscription = async (req, res) => {
  try {
    const { subscription_id } = req.body;
    const payload = {
      id: subscription_id
    };
    const response = await flw.Subscription.cancel(payload);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get User Subscription Details
exports.getSubscriptionDetails = async (req, res) => {
  try {
    const { email } = req.params;
    const data = {
      email: email
    };
    const response = await flw.Subscription.get(data);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
