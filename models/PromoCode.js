const mongoose = require('mongoose');

// Helper function to generate a unique 10-digit promoID
const generatePromoID = () => {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
};

const promoCodeSchema = new mongoose.Schema({
  promoID: { 
    type: String, 
    unique: true, 
    default: generatePromoID 
  },
  promoCode: { type: String, required: true },
  promoName: { type: String, required: true },
  discountPercent: { type: Number, required: true },
  dateCreated: { type: Date, default: Date.now },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['active', 'expired', 'paused'], 
    default: 'active' 
  }
});

const PromoCode = mongoose.model('PromoCode', promoCodeSchema);
module.exports = PromoCode;
