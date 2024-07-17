const mongoose = require("mongoose");

const splitBillSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  totalAmount: { type: Number, required: true },
  paidAmount: { type: Number, default: 0 },
  members: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      shareAmount: { type: Number, required: true },
      paidAmount: { type: Number, default: 0 },
      status: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' }
    }
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("SplitBill", splitBillSchema);
