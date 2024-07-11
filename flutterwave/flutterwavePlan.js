const Flutterwave = require('flutterwave-node-v3');

const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY  );

const createMonthlyPlan = async () => {
  try {
    const existingPlans = await flw.PaymentPlan.get_all();
    const planExists = existingPlans.data.some(plan => plan.name === 'Splinx-Planet monthly subscription plan: Platinum 9.99 usd/month');
    if (!planExists) {
      const payload = {
        amount: 9.99,
        name: 'Splinx-Planet monthly subscription plan: Platinum 9.99 usd/month',
        interval: 'monthly',
        currency: 'USD',
      };
      const response = await flw.PaymentPlan.create(payload);
      console.log(response);
    } else {
      console.log('Monthly plan already exists');
    }
  } catch (error) {
    console.log(error);
  }
};

const createSixMonthlyPlan = async () => {
  try {
    const existingPlans = await flw.PaymentPlan.get_all();
    const planExists = existingPlans.data.some(plan => plan.name === 'Splinx-Planet six monthly subscription plan: Platinum 53.94 usd/6-month');
    if (!planExists) {
      const payload = {
        amount: 53.94,
        name: 'Splinx-Planet six monthly subscription plan: Platinum 53.94 usd/6-month',
        interval: 'quarterly',
        currency: 'USD',
      };
      const response = await flw.PaymentPlan.create(payload);
      console.log(response);
    } else {
      console.log('Six-monthly plan already exists');
    }
  } catch (error) {
    console.log(error);
  }
};

const createYearlyPlan = async () => {
  try {
    const existingPlans = await flw.PaymentPlan.get_all();
    const planExists = existingPlans.data.some(plan => plan.name === 'Splinx-Planet yearly subscription plan: Platinum 95.88 usd/year');
    if (!planExists) {
      const payload = {
        amount: 95.88,
        name: 'Splinx-Planet yearly subscription plan: Platinum 95.88 usd/year',
        interval: 'yearly',
        currency: 'USD',
      };
      const response = await flw.PaymentPlan.create(payload);
      console.log(response);
    } else {
      console.log('Yearly plan already exists');
    }
  } catch (error) {
    console.log(error);
  }
};

const createBallersPlan = async () => {
  try {
    const existingPlans = await flw.PaymentPlan.get_all();
    const planExists = existingPlans.data.some(plan => plan.name === 'Splinx-Planet yearly subscription plan: Ballers upgrade 359.88 usd/year');
    if (!planExists) {
      const payload = {
        amount: 359.88,
        name: 'Splinx-Planet yearly subscription plan: Ballers upgrade 359.88 usd/year',
        interval: 'yearly',
        currency: 'USD',
      };
      const response = await flw.PaymentPlan.create(payload);
      console.log(response);
    } else {
      console.log('Ballers plan already exists');
    }
  } catch (error) {
    console.log(error);
  }
};

// exports function 
module.exports = { createMonthlyPlan, createSixMonthlyPlan, createYearlyPlan, createBallersPlan}
