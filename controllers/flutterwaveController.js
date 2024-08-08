const Flutterwave = require('flutterwave-node-v3');
const flwSecretKey = process.env.FLW_SECRET_KEY;
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
        'Authorization': `Bearer ${flwSecretKey}`
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

// Wallet funding create payment endpoint
exports.walletFunding = async (req, res) => {
  const { amount, currency, email, name, phonenumber, description } = req.body;
  const tx_ref = `tx-${Date.now()}`;

  try {
    const response = await fetch('https://api.flutterwave.com/v3/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${flwSecretKey}`
      },
      body: JSON.stringify({
        tx_ref,
        amount,
        currency,
        redirect_url: 'https://your-app.com/wallet-payment-success',
        customer: {
          email,
          name,
          phonenumber 
        },
        customizations: {
          title: 'Splinx-Planet Wallet Funding',
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

// Verify any payment transaction
exports.verifyTransaction = async (req, res) => {
    const transactionId = req.params.id;

    try {
        const response = await fetch(`https://api.flutterwave.com/v3/transactions/${transactionId}/verify`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${flwSecretKey}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (response.ok && data.status === 'success') {
            return res.status(200).json({
                status: 'success',
                message: 'Transaction fetched successfully',
                data: data.data
            });
        } else {
            return res.status(400).json({
                status: 'error',
                message: 'Unable to verify transaction',
                data: data
            });
        }
    } catch (error) {
        console.error('Error verifying transaction:', error.message);

        if (error.response && error.response.status === 401) {
            return res.status(401).json({
                status: 'error',
                message: 'Unauthorized: Invalid API Key'
            });
        } else {
            return res.status(500).json({
                status: 'error',
                message: 'An error occurred while verifying the transaction',
                error: error.message
            });
        }
    }
};