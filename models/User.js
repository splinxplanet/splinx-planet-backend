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
  myInterest: [Object],
  hashtagFollowing: [Object],
});

module.exports = mongoose.model("User", userSchema);
