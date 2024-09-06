const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const withdrawalRequestSchema = new Schema({
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  eventName: {
    type: String,
    required: true,
  },
  eventCost: {
    type: Number,
    required: true,
  },
  totalPaidByMembers: {
    type: Number,
    required: true,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  bankName: {
    type: String,
    required: true,
  },
  accountNumber: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('WithdrawalRequest', withdrawalRequestSchema);
