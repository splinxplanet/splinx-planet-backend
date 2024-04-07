const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  dob: Date,
  age: Number,
  bio: String,
  profileImg: String,
  phoneNumber: String,
  emailAddress: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
  },
  password: {
        type: String,
        required: true,
  },
  country: String,
  city: String,
  homeAddress: String,
  enableNotification: {
        type: Boolean,
        default: false,
    },
  myInterest: [{
      id: String,
      interest: String,
      isSelected: Boolean,
  }],
  hashtagFollowing: [{
      id: String,
      tag: String,
      isSelected: Boolean,
        
  }],
  isAppInstalled: {
      type: Boolean,
      default: true,
    },
  friendRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  sentFriendRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
},
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
