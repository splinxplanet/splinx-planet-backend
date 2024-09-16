const mongoose = require('mongoose');

const advertSchema = new mongoose.Schema({
  businessName: { type: String, required: true },
  businessAddress: { type: String, required: true },
  businessPhone: { type: String, required: true },
  adsText: { type: String, required: true },
  adsImage: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  adsStatus: {
    type: String,
    enum: ['active', 'pause', 'expired'],
    default: 'active'
  },
  adsPosition: {
    type: String,
    enum: ['homeTop', 'eventsCard', 'footer'],
    required: true
  },
  createdBy: { type: String, required: true },
  createdDate: { type: Date, default: Date.now },
  adsCost: { type: Number, required: true }
}, { timestamps: true });

const Advert = mongoose.model('Advert', advertSchema);
module.exports = Advert;
