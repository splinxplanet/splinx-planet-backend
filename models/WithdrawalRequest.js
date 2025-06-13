const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const withdrawalRequestSchema = new Schema({
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
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
  holdDate: {type: Date},
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
  accountName: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
}, { timestamps: true });

module.exports = mongoose.model('WithdrawalRequest', withdrawalRequestSchema);
