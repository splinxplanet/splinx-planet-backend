const PromoCode = require('../models/PromoCode');

// Create a new promo code
exports.createPromoCode = async (req, res) => {
  try {
    const newPromoCode = await PromoCode.create(req.body);
    res.status(201).json({ success: true, data: newPromoCode });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Fetch all promo codes
exports.getAllPromoCodes = async (req, res) => {
  try {
    const promoCodes = await PromoCode.find();
    res.status(200).json({ success: true, data: promoCodes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Fetch a single promo code by ID
exports.getPromoCodeById = async (req, res) => {
  try {
    const promoCode = await PromoCode.findById(req.params.id);
    if (!promoCode) {
      return res.status(404).json({ success: false, message: 'Promo code not found' });
    }
    res.status(200).json({ success: true, data: promoCode });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update an existing promo code
exports.updatePromoCode = async (req, res) => {
  try {
    const updatedPromoCode = await PromoCode.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedPromoCode) {
      return res.status(404).json({ success: false, message: 'Promo code not found' });
    }
    res.status(200).json({ success: true, data: updatedPromoCode });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a promo code
exports.deletePromoCode = async (req, res) => {
  try {
    const promoCode = await PromoCode.findByIdAndDelete(req.params.id);
    if (!promoCode) {
      return res.status(404).json({ success: false, message: 'Promo code not found' });
    }
    res.status(200).json({ success: true, message: 'Promo code deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Pause a promo code
exports.pausePromoCode = async (req, res) => {
  try {
    const promoCode = await PromoCode.findById(req.params.id);
    if (!promoCode) {
      return res.status(404).json({ success: false, message: 'Promo code not found' });
    }
    promoCode.status = 'paused';
    await promoCode.save();
    res.status(200).json({ success: true, data: promoCode });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Restart a promo code
exports.restartPromoCode = async (req, res) => {
  try {
    const promoCode = await PromoCode.findById(req.params.id);
    if (!promoCode) {
      return res.status(404).json({ success: false, message: 'Promo code not found' });
    }
    promoCode.status = 'active';
    await promoCode.save();
    res.status(200).json({ success: true, data: promoCode });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
