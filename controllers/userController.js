const User = require("../models/User");

// Get user profile
exports.getUserProfile = async (req, res) => {
    const user = await User.findById(req.userId).select("-password");

    res.json(user);
}

// Update user profile
exports.updateUserProfile = async (req, res) => {
    await User.findByIdAndUpdate(req.userId, req.body);

    res.json({ message: "User profile updated successfully" });
}

// Delete user profile
exports.deleteUserProfile = async (req, res) => {
    await User.findByIdAndDelete(req.userId);

    res.json({ message: "User profile deleted successfully" });
}
    