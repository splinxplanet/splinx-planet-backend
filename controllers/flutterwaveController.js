const Flutterwave = require('flutterwave-node-v3');
const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);


// create subscription plans
exports.createPlan = async (req, res) => { 
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

// Create payment endpoint
exports.createPayment = async (req, res) => {
  const { amount, currency, email, name, phonenumber, description, payment_plan } = req.body;
  const tx_ref = `tx-${Date.now()}`;

  try {
    const response = await fetch('https://api.flutterwave.com/v3/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.FLW_SECRET_KEY}`
      },
      body: JSON.stringify({
        tx_ref,
        amount,
        payment_plan,
        currency,
        redirect_url: 'https://your-app.com/payment-success',
        customer: {
          email,
          name,
          phonenumber
        },
        customizations: {
          title: 'Splinx-Planet Subscription Payment',
          description
        }
      })
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// transaction verification
exports.verifyTransaction = async (req, res) => {
  const { tx_ref } = req.body;

  if (!tx_ref) {
    return res.status(400).json({ message: 'Transaction reference (tx_ref) is required' });
  }

  try {
    const payload = { "tx_ref": tx_ref };
    const response = await flw.Transaction.verify(payload);

    if (response.status === 'success') {
      return res.status(200).json({ message: 'Transaction verified successfully', data: response.data });
    } else {
      return res.status(400).json({ message: 'Transaction verification failed', data: response.data });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};