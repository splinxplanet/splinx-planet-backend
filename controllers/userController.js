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

//endpoint to send a request to a user
exports.sendFriendRequest =  async (req, res) => {
  const { currentUserId, selectedUserId } = req.body;

  try {
    //update the recipient's friendRequestsArray!
    await User.findByIdAndUpdate(selectedUserId, {
      $push: { friendRequests: currentUserId },
    });

    //update the sender's sentFriendRequests array
    await User.findByIdAndUpdate(currentUserId, {
      $push: { sentFriendRequests: selectedUserId },
    });

    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
};

//endpoint to show all the friend-requests of a particular user
exports.showAllFriendRequest = async (req, res) => {
  try {
    const { userId } = req.params;

    //fetch the user document based on the User id
    const user = await User.findById(userId)
      .populate("friendRequests", "firstName emailAddress profileImg")
      .lean();

    const friendRequests = user.friendRequests;

    res.json(friendRequests);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//endpoint to accept a friend-request of a particular person
exports.acceptFriendRequest = async (req, res) => {
  try {
    const { senderId, recipientId } = req.body;

    //retrieve the documents of sender and the recipient
    const sender = await User.findById(senderId);
    const recipient = await User.findById(recipientId);

    sender.friends.push(recipientId);
    recipient.friends.push(senderId);

    recipient.friendRequests = recipient.friendRequests.filter(
      (request) => request.toString() !== senderId.toString()
    );

    sender.sentFriendRequests = sender.sentFriendRequests.filter(
      (request) => request.toString() !== recipientId.toString
    );

    await sender.save();
    await recipient.save();

    res.status(200).json({ message: "Friend Request accepted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//endpoint to access all the friends of the logged in user!
exports.loginFriends = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate(
      "friends",
      "firstName emailAddress profileImg"
    );
    const acceptedFriends = user.friends;
    res.json(acceptedFriends);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
    