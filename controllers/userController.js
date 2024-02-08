const User = require("../models/User");

// Get user profile
exports.getUserProfile = async (req, res) => {
    console.log(req.params.userId)
    try {
        // Assuming req.userId contains the ID of the authenticated user
        const user = await User.findById(req.params.userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
// Update user profile
exports.updateUserProfile = async (req, res) => {
    await User.findByIdAndUpdate(req.params.userId, req.body);

    res.json({ message: "User profile updated successfully" });
}

// Delete user profile
exports.deleteUserProfile = async (req, res) => {
    await User.findByIdAndDelete(req.params.userId);

    res.json({ message: "User profile deleted successfully" });
}
    